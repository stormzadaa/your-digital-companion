CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY,
  nome TEXT,
  referral_code TEXT NOT NULL UNIQUE,
  referred_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  spins INTEGER NOT NULL DEFAULT 0,
  balance NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_nome TEXT,
  spins INTEGER NOT NULL DEFAULT 0,
  spins_required INTEGER NOT NULL DEFAULT 100,
  reward NUMERIC(12,2) NOT NULL DEFAULT 50,
  claimed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.referrals TO authenticated;
GRANT ALL ON public.referrals TO service_role;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "referrals_select_involved" ON public.referrals FOR SELECT TO authenticated
  USING (referrer_id = auth.uid() OR referred_id = auth.uid());

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.ensure_profile(_nome TEXT DEFAULT NULL)
RETURNS public.profiles LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _uid UUID := auth.uid(); _code TEXT; _row public.profiles;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  SELECT * INTO _row FROM public.profiles WHERE id = _uid;
  IF FOUND THEN
    IF _nome IS NOT NULL AND (_row.nome IS NULL OR _row.nome = '') THEN
      UPDATE public.profiles SET nome = _nome WHERE id = _uid RETURNING * INTO _row;
    END IF;
    RETURN _row;
  END IF;
  LOOP
    _code := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 7));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE referral_code = _code);
  END LOOP;
  INSERT INTO public.profiles (id, nome, referral_code) VALUES (_uid, _nome, _code) RETURNING * INTO _row;
  RETURN _row;
END; $$;

CREATE OR REPLACE FUNCTION public.apply_referral(_code TEXT)
RETURNS public.profiles LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _uid UUID := auth.uid(); _me public.profiles; _ref public.profiles;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  SELECT * INTO _me FROM public.profiles WHERE id = _uid;
  IF NOT FOUND THEN RAISE EXCEPTION 'perfil inexistente'; END IF;
  IF _me.referred_by IS NOT NULL THEN RAISE EXCEPTION 'você já usou um código de indicação'; END IF;
  SELECT * INTO _ref FROM public.profiles WHERE referral_code = upper(trim(_code));
  IF NOT FOUND THEN RAISE EXCEPTION 'código inválido'; END IF;
  IF _ref.id = _uid THEN RAISE EXCEPTION 'você não pode indicar a si mesmo'; END IF;
  UPDATE public.profiles SET referred_by = _ref.id WHERE id = _uid RETURNING * INTO _me;
  INSERT INTO public.referrals (referrer_id, referred_id, referred_nome, spins)
  VALUES (_ref.id, _uid, _me.nome, _me.spins)
  ON CONFLICT (referred_id) DO NOTHING;
  RETURN _me;
END; $$;

CREATE OR REPLACE FUNCTION public.add_spins(_qtd INTEGER)
RETURNS public.profiles LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _uid UUID := auth.uid(); _row public.profiles;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  IF _qtd IS NULL OR _qtd < 1 OR _qtd > 50 THEN RAISE EXCEPTION 'quantidade inválida'; END IF;
  UPDATE public.profiles SET spins = spins + _qtd WHERE id = _uid RETURNING * INTO _row;
  IF NOT FOUND THEN RAISE EXCEPTION 'perfil inexistente'; END IF;
  UPDATE public.referrals SET spins = _row.spins WHERE referred_id = _uid;
  RETURN _row;
END; $$;

CREATE OR REPLACE FUNCTION public.open_chest(_referral_id UUID)
RETURNS public.referrals LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _uid UUID := auth.uid(); _row public.referrals;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  SELECT * INTO _row FROM public.referrals WHERE id = _referral_id AND referrer_id = _uid FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'baú não encontrado'; END IF;
  IF _row.claimed_at IS NOT NULL THEN RAISE EXCEPTION 'baú já aberto'; END IF;
  IF _row.spins < _row.spins_required THEN RAISE EXCEPTION 'o indicado ainda não completou % giros', _row.spins_required; END IF;
  UPDATE public.referrals SET claimed_at = now() WHERE id = _referral_id RETURNING * INTO _row;
  UPDATE public.profiles SET balance = balance + _row.reward WHERE id = _uid;
  RETURN _row;
END; $$;
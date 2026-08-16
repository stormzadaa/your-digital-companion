REVOKE EXECUTE ON FUNCTION public.ensure_profile(TEXT) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.apply_referral(TEXT) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.add_spins(INTEGER) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.open_chest(UUID) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.ensure_profile(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.apply_referral(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_spins(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.open_chest(UUID) TO authenticated;
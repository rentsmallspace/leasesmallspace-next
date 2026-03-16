-- Add monthly Triple Net (NNN) expenses column for display on property pages
-- Listed price is base rent; this is the monthly NNN amount shown as a separate line item
ALTER TABLE lss_properties ADD COLUMN IF NOT EXISTS nnn_monthly NUMERIC(10, 2);

COMMENT ON COLUMN lss_properties.nnn_monthly IS 'Monthly Triple Net (NNN) expenses in dollars; displayed as separate line item from base rent';

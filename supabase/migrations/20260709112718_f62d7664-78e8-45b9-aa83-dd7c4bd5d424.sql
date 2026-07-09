
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category_fa TEXT;

UPDATE public.products SET category_fa = 'موبایل و تبلت'
  WHERE category_fa IS NULL AND category IN ('mobile','tablet','phone','phones','tablets','موبایل','تبلت','گوشی','گوشی موبایل','تلفن همراه');

UPDATE public.products SET category_fa = 'ساعت هوشمند'
  WHERE category_fa IS NULL AND category IN ('smartwatch','smart watch','watch','ساعت هوشمند','لوازم جانبی ساعت هوشمند');

UPDATE public.products SET category_fa = 'هندزفری و تجهیزات صوتی'
  WHERE category_fa IS NULL AND category IN ('earphone','headphone','earbuds','speaker','هندزفری','هدفون','اسپیکر','باند','هندزفری و هدفون توگوشی','باند و اسپیکر','لوازم جانبی هندزفری');

UPDATE public.products SET category_fa = 'لپ‌تاپ و کامپیوتر'
  WHERE category_fa IS NULL AND category IN ('laptop','laptops','netbook','monitor','display','لپ‌تاپ','لپ تاپ','نت‌بوک','نت بوک','قطعات اصلی کامپیوتر','مانیتور و نمایشگر','قطعات کامپیوتر','مانیتور');

UPDATE public.products SET category_fa = 'کنسول و گیمینگ'
  WHERE category_fa IS NULL AND category IN ('console','gaming','gaming console','کنسول','کنسول و دستگاه بازی','تجهیزات گیمینگ','گیمینگ');

UPDATE public.products SET category_fa = 'لوازم جانبی و شبکه'
  WHERE category_fa IS NULL AND category IN ('accessory','accessories','لوازم جانبی','لوازم جانبی موبایل','لوازم جانبی موبایل}','لوازم جانبی کامپیوتر','لوازم جانبی لپ‌تاپ','لوازم جانبی تبلت','تجهیزات ذخیره‌سازی','مودم و تجهیزات شبکه','storage','ssd','hdd','modem','router','network');

CREATE INDEX IF NOT EXISTS idx_products_category_fa ON public.products(category_fa);

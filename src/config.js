// Cấu hình Supabase. Hai giá trị này là khóa công khai (được thiết kế để nằm trong app web).
// Không bao giờ đặt secret key / service_role key ở đây.
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://wiwdekeuizjsftkdiikd.supabase.co'
export const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY || 'sb_publishable__Xhsxn-33KxV_JHS4WJ5ww_Y2-Ag_yi'

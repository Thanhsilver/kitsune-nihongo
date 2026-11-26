# Kitsune Nihongo: app học tiếng Nhật

React 18 + Vite + Tailwind CSS 3. Phong cách Japanese Cozy Cartoon, mascot cáo Kitsune.

## Chạy thử

```bash
npm install
npm run dev      # mở http://localhost:5173
npm run build    # bản build tĩnh nằm trong thư mục dist/
```

## Cấu trúc

```
src/
  App.jsx               Khung app: sidebar, thanh điều hướng điện thoại, chuyển trang (#hash), dark mode
  pages/                Trang chủ, Lộ trình, Bảng chữ cái, Kanji, Từ vựng, Luyện viết, Trò chơi & Quiz, Thành tích, Cài đặt, Bài học
  components/
    Mascot.jsx          Cáo Kitsune (wave, happy, think, cheer, sleep, sad)
    Illus.jsx           Bộ hình minh họa cartoon cho từ vựng
    Icons.jsx           Icon đồng bộ
    Quiz.jsx            Bộ chạy quiz (chọn nghĩa, chọn chữ, nghe, nhìn hình, chọn hình, gõ lại)
    Games.jsx           Ghép từ, Sắp xếp câu
    WritingBoard.jsx    Bảng viết, chấm từng nét
    ui.jsx              Nút, thanh tiến độ, hoạt ảnh nét, mẹo nhớ, ăn mừng, huy hiệu
  data/                 Kana, kanji, từ vựng, câu ví dụ, mẹo nhớ, lộ trình bài học
  lib/                  Lưu trạng thái (XP, chuỗi ngày, huy hiệu, lặp lại ngắt quãng), âm thanh, nét chữ, quiz
public/
  strokes.json          Dữ liệu thứ tự nét (KanjiVG, CC BY-SA 3.0)
  audio-ai.json         Phát âm giọng AI (Kokoro) cho chữ và từ
  audio-ex.json         Phát âm câu ví dụ
  audio.json            Giọng đọc cũ
```

## Bảng màu (tailwind.config.js)

| Tên     | Mã      |
|---------|---------|
| sakura  | #FFB7C5 |
| primary | #E85D75 |
| matcha  | #BFE3D0 |
| cream   | #FFF8EF |
| ink     | #303345 |

Font: Nunito ExtraBold (tiêu đề), Be Vietnam Pro (nội dung), Noto Sans JP (tiếng Nhật), Nunito Bold (nút bấm).

## Thêm bài học

- Thêm từ vào `src/data/core.js` (mảng `V5` hoặc `V4`) và câu ví dụ vào `src/data/examples.js`.
- Thêm trạm vào `src/data/lessons.js`. Các vùng N3, N2, N1 đang để khóa (`locked: true`) chờ bổ sung nội dung.

## Luyện phát âm (thu âm)

Dùng capability `dictation` của artifact Claude (`window.claude.use('dictation')`, xem `src/lib/mic.js`). Khi chạy ở môi trường khác (localhost, Safari, Firefox, app điện thoại) capability này không có, nên các bài nói tự bỏ qua. Muốn chạy độc lập, có thể thay `src/lib/mic.js` bằng Web Speech API (`SpeechRecognition`, `lang = 'ja-JP'`) với cùng giao diện `start/stop/onPartial/onFinal/onState`.

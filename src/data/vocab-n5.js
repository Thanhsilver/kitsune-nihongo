// Từ vựng N5 đầy đủ theo chủ đề (như danh sách ôn thi JLPT N5).
// Mỗi dòng: kanji;kana;nghĩa tiếng Việt;Hán Việt;loại  (loại: c chào hỏi · n danh từ · v động từ · a tính từ · t thời gian · x từ khác)
// Từ đã có sẵn trong app giữ nguyên dữ liệu cũ, chỉ được gắn thêm chủ đề.
export const TOPICS = [
['greet', 'Chào hỏi & giao tiếp', 'wave', `
;こんにちは;xin chào;;c
;ありがとう;cảm ơn;;c
;すみません;xin lỗi, làm phiền;;c
;おはよう;chào buổi sáng;;c
;さようなら;tạm biệt;;c
;はい;vâng, có;;c
;いいえ;không;;c
;おはようございます;chào buổi sáng (lịch sự);;c
;こんばんは;chào buổi tối;;c
;おやすみなさい;chúc ngủ ngon;;c
;ありがとうございます;cảm ơn (lịch sự);;c
;どうも;cảm ơn; rất;;c
;どういたしまして;không có gì;;c
;ごめんなさい;xin lỗi;;c
;はじめまして;rất hân hạnh được gặp;;c
;どうぞよろしく;rất mong được giúp đỡ;;c
;どうぞ;xin mời;;c
;いただきます;mời mọi người ăn (trước bữa);;c
;ごちそうさまでした;cảm ơn vì bữa ăn (sau bữa);;c
;いってきます;con đi đây;;c
;いってらっしゃい;đi cẩn thận nhé;;c
;ただいま;con về rồi đây;;c
;おかえりなさい;mừng về nhà;;c
;もしもし;a lô;;c
;じゃあ;vậy thì;;c
;では;vậy thì (lịch sự);;c
;ええ;vâng (thân mật);;c
;そう;đúng vậy, thế à;;c
;ちょっと;một chút; hơi;;c
お元気ですか;おげんきですか;bạn có khỏe không?;Nguyên Khí;c
失礼します;しつれいします;xin phép (làm phiền);Thất Lễ;c
お願いします;おねがいします;xin nhờ, làm ơn;Nguyện;c
`],
['people', 'Con người & gia đình', 'family', `
私;わたし;tôi;Tư;n
人;ひと;người;Nhân;n
友達;ともだち;bạn bè;Hữu Đạt;n
家族;かぞく;gia đình;Gia Tộc;n
母;はは;mẹ (của mình);Mẫu;n
父;ちち;bố (của mình);Phụ;n
名前;なまえ;tên;Danh Tiền;n
あなた;あなた;bạn, anh, chị;;n
私たち;わたしたち;chúng tôi;Tư;n
男;おとこ;nam, đàn ông;Nam;n
女;おんな;nữ, phụ nữ;Nữ;n
男の子;おとこのこ;bé trai;Nam Tử;n
女の子;おんなのこ;bé gái;Nữ Tử;n
男の人;おとこのひと;người đàn ông;Nam Nhân;n
女の人;おんなのひと;người phụ nữ;Nữ Nhân;n
子供;こども;trẻ em, con cái;Tử Cung;n
大人;おとな;người lớn;Đại Nhân;n
お父さん;おとうさん;bố (người khác / gọi bố);Phụ;n
お母さん;おかあさん;mẹ (người khác / gọi mẹ);Mẫu;n
兄;あに;anh trai (của mình);Huynh;n
姉;あね;chị gái (của mình);Tỷ;n
弟;おとうと;em trai;Đệ;n
妹;いもうと;em gái;Muội;n
お兄さん;おにいさん;anh trai (người khác);Huynh;n
お姉さん;おねえさん;chị gái (người khác);Tỷ;n
兄弟;きょうだい;anh chị em;Huynh Đệ;n
両親;りょうしん;bố mẹ;Lưỡng Thân;n
祖父;そふ;ông (của mình);Tổ Phụ;n
祖母;そぼ;bà (của mình);Tổ Mẫu;n
おじいさん;おじいさん;ông; ông cụ;;n
おばあさん;おばあさん;bà; bà cụ;;n
おじさん;おじさん;chú, bác (nam);;n
おばさん;おばさん;cô, dì, bác (nữ);;n
夫;おっと;chồng (của mình);Phu;n
妻;つま;vợ (của mình);Thê;n
奥さん;おくさん;vợ (người khác);Áo;n
主人;しゅじん;chồng (của mình);Chủ Nhân;n
赤ちゃん;あかちゃん;em bé;Xích;n
皆さん;みなさん;mọi người (lịch sự);Giai;n
皆;みんな;mọi người;Giai;n
自分;じぶん;bản thân;Tự Phân;n
誰;だれ;ai;Thùy;x
どなた;どなた;vị nào (lịch sự);;x
外国人;がいこくじん;người nước ngoài;Ngoại Quốc Nhân;n
日本人;にほんじん;người Nhật;Nhật Bản Nhân;n
`],
['body', 'Cơ thể & sức khỏe', 'heart', `
体;からだ;cơ thể;Thể;n
頭;あたま;cái đầu;Đầu;n
顔;かお;khuôn mặt;Nhan;n
目;め;mắt;Mục;n
耳;みみ;tai;Nhĩ;n
鼻;はな;mũi;Tỵ;n
口;くち;miệng;Khẩu;n
歯;は;răng;Xỉ;n
手;て;tay;Thủ;n
足;あし;chân;Túc;n
お腹;おなか;bụng;Phúc;n
背;せ;chiều cao; lưng;Bối;n
声;こえ;giọng nói;Thanh;n
病気;びょうき;bệnh;Bệnh Khí;n
風邪;かぜ;cảm cúm;Phong Tà;n
薬;くすり;thuốc;Dược;n
元気;げんき;khỏe mạnh;Nguyên Khí;a
痛い;いたい;đau;Thống;a
`],
['school', 'Trường học & công việc', 'school', `
学校;がっこう;trường học;Học Hiệu;n
先生;せんせい;thầy cô giáo;Tiên Sinh;n
学生;がくせい;học sinh, sinh viên;Học Sinh;n
本;ほん;sách;Bản;n
大学;だいがく;đại học;Đại Học;n
大学生;だいがくせい;sinh viên đại học;Đại Học Sinh;n
留学生;りゅうがくせい;du học sinh;Lưu Học Sinh;n
生徒;せいと;học sinh (phổ thông);Sinh Đồ;n
教室;きょうしつ;phòng học;Giáo Thất;n
授業;じゅぎょう;giờ học, tiết học;Thụ Nghiệp;n
宿題;しゅくだい;bài tập về nhà;Túc Đề;n
試験;しけん;kỳ thi;Thí Nghiệm;n
テスト;テスト;bài kiểm tra;;n
問題;もんだい;câu hỏi, vấn đề;Vấn Đề;n
答え;こたえ;câu trả lời;Đáp;n
質問;しつもん;câu hỏi;Chất Vấn;n
練習;れんしゅう;luyện tập;Luyện Tập;n
勉強;べんきょう;việc học;Miễn Cường;n
言葉;ことば;từ ngữ;Ngôn Diệp;n
漢字;かんじ;chữ Hán;Hán Tự;n
平仮名;ひらがな;chữ Hiragana;Bình Giả Danh;n
片仮名;かたかな;chữ Katakana;Phiến Giả Danh;n
日本語;にほんご;tiếng Nhật;Nhật Bản Ngữ;n
英語;えいご;tiếng Anh;Anh Ngữ;n
作文;さくぶん;bài văn;Tác Văn;n
意味;いみ;ý nghĩa;Ý Vị;n
辞書;じしょ;từ điển;Từ Thư;n
教科書;きょうかしょ;sách giáo khoa;Giáo Khoa Thư;n
ノート;ノート;vở;;n
鉛筆;えんぴつ;bút chì;Duyên Bút;n
万年筆;まんねんひつ;bút máy;Vạn Niên Bút;n
ページ;ページ;trang;;n
字;じ;chữ;Tự;n
文章;ぶんしょう;đoạn văn;Văn Chương;n
外国語;がいこくご;ngoại ngữ;Ngoại Quốc Ngữ;n
ペン;ペン;bút;;n
ボールペン;ボールペン;bút bi;;n
消しゴム;けしゴム;cục tẩy;Tiêu;n
紙;かみ;giấy;Chỉ;n
図書館;としょかん;thư viện;Đồ Thư Quán;n
夏休み;なつやすみ;nghỉ hè;Hạ Hưu;n
休み;やすみ;ngày nghỉ, kỳ nghỉ;Hưu;n
クラス;クラス;lớp học;;n
仕事;しごと;công việc;Sĩ Sự;n
会社;かいしゃ;công ty;Hội Xã;n
会社員;かいしゃいん;nhân viên công ty;Hội Xã Viên;n
医者;いしゃ;bác sĩ;Y Giả;n
警官;けいかん;cảnh sát;Cảnh Quan;n
お巡りさん;おまわりさん;chú cảnh sát;Tuần;n
`],
['food', 'Đồ ăn & đồ uống', 'tea', `
水;みず;nước;Thủy;n
魚;さかな;cá;Ngư;n
肉;にく;thịt;Nhục;n
お茶;おちゃ;trà;Trà;n
ご飯;ごはん;cơm; bữa ăn;Phạn;n
朝ご飯;あさごはん;bữa sáng;Triêu Phạn;n
昼ご飯;ひるごはん;bữa trưa;Trú Phạn;n
晩ご飯;ばんごはん;bữa tối;Vãn Phạn;n
食べ物;たべもの;đồ ăn;Thực Vật;n
飲み物;のみもの;đồ uống;Ẩm Vật;n
料理;りょうり;món ăn; nấu ăn;Liệu Lý;n
お弁当;おべんとう;cơm hộp;Biện Đương;n
パン;パン;bánh mì;;n
米;こめ;gạo;Mễ;n
卵;たまご;trứng;Noãn;n
牛肉;ぎゅうにく;thịt bò;Ngưu Nhục;n
豚肉;ぶたにく;thịt lợn;Đồn Nhục;n
鶏肉;とりにく;thịt gà;Kê Nhục;n
野菜;やさい;rau;Dã Thái;n
果物;くだもの;hoa quả;Quả Vật;n
りんご;りんご;quả táo;;n
みかん;みかん;quả quýt;;n
バナナ;バナナ;quả chuối;;n
牛乳;ぎゅうにゅう;sữa bò;Ngưu Nhũ;n
コーヒー;コーヒー;cà phê;;n
紅茶;こうちゃ;hồng trà;Hồng Trà;n
ジュース;ジュース;nước ép;;n
お酒;おさけ;rượu;Tửu;n
ビール;ビール;bia;;n
お菓子;おかし;bánh kẹo;Quả Tử;n
砂糖;さとう;đường;Sa Đường;n
塩;しお;muối;Diêm;n
醤油;しょうゆ;xì dầu;Tương Du;n
バター;バター;bơ;;n
カレー;カレー;cà ri;;n
すき焼き;すきやき;lẩu sukiyaki;Thiêu;n
てんぷら;てんぷら;tempura;;n
アイスクリーム;アイスクリーム;kem;;n
レストラン;レストラン;nhà hàng;;n
食堂;しょくどう;nhà ăn;Thực Đường;n
喫茶店;きっさてん;quán cà phê;Khiết Trà Điếm;n
メニュー;メニュー;thực đơn;;n
お箸;おはし;đôi đũa;Trợ;n
スプーン;スプーン;cái thìa;;n
ナイフ;ナイフ;con dao;;n
フォーク;フォーク;cái dĩa;;n
お皿;おさら;cái đĩa;Mãnh;n
茶碗;ちゃわん;bát cơm;Trà Uyển;n
コップ;コップ;cái cốc;;n
カップ;カップ;cái tách;;n
おいしい;おいしい;ngon;;a
まずい;まずい;dở (đồ ăn);;a
甘い;あまい;ngọt;Cam;a
辛い;からい;cay;Tân;a
お腹がすく;おなかがすく;đói bụng;Phúc;v
`],
['home', 'Nhà cửa & đồ dùng', 'house', `
家;いえ;nhà;Gia;n
うち;うち;nhà (của mình);;n
部屋;へや;căn phòng;Bộ Ốc;n
台所;だいどころ;nhà bếp;Đài Sở;n
お風呂;おふろ;bồn tắm;Phong Lữ;n
シャワー;シャワー;vòi hoa sen;;n
トイレ;トイレ;nhà vệ sinh;;n
お手洗い;おてあらい;nhà vệ sinh (lịch sự);Thủ Tẩy;n
玄関;げんかん;lối vào nhà;Huyền Quan;n
階段;かいだん;cầu thang;Giai Đoạn;n
窓;まど;cửa sổ;Song;n
ドア;ドア;cửa;;n
戸;と;cửa (kéo);Hộ;n
門;もん;cổng;Môn;n
庭;にわ;khu vườn;Đình;n
壁;かべ;bức tường;Bích;n
机;つくえ;cái bàn học;Cơ;n
椅子;いす;cái ghế;Ỷ Tử;n
テーブル;テーブル;cái bàn;;n
ベッド;ベッド;giường;;n
本棚;ほんだな;giá sách;Bản Bằng;n
冷蔵庫;れいぞうこ;tủ lạnh;Lãnh Tàng Khố;n
テレビ;テレビ;ti vi;;n
ラジオ;ラジオ;radio;;n
電話;でんわ;điện thoại;Điện Thoại;n
電気;でんき;điện, đèn điện;Điện Khí;n
ストーブ;ストーブ;lò sưởi;;n
時計;とけい;đồng hồ;Thời Kế;n
カメラ;カメラ;máy ảnh;;n
写真;しゃしん;bức ảnh;Tả Chân;n
パソコン;パソコン;máy tính cá nhân;;n
カレンダー;カレンダー;lịch;;n
かばん;かばん;cái cặp, túi;;n
傘;かさ;cái ô;Tản;n
鍵;かぎ;chìa khóa;Kiện;n
財布;さいふ;cái ví;Tài Bố;n
箱;はこ;cái hộp;Tương;n
物;もの;đồ vật;Vật;n
事;こと;việc, chuyện;Sự;n
灰皿;はいざら;cái gạt tàn;Hôi Mãnh;n
花瓶;かびん;bình hoa;Hoa Bình;n
石鹸;せっけん;xà phòng;Thạch Kiềm;n
タオル;タオル;khăn tắm;;n
新聞;しんぶん;báo giấy;Tân Văn;n
雑誌;ざっし;tạp chí;Tạp Chí;n
ニュース;ニュース;tin tức;;n
手紙;てがみ;bức thư;Thủ Chỉ;n
切手;きって;tem;Thiết Thủ;n
葉書;はがき;bưu thiếp;Diệp Thư;n
封筒;ふうとう;phong bì;Phong Đồng;n
地図;ちず;bản đồ;Địa Đồ;n
アパート;アパート;căn hộ;;n
マンション;マンション;chung cư cao cấp;;n
掃除;そうじ;dọn dẹp;Tảo Trừ;n
洗濯;せんたく;giặt giũ;Tẩy Trạc;n
`],
['clothes', 'Quần áo & màu sắc', 'shirt', `
服;ふく;quần áo;Phục;n
洋服;ようふく;quần áo kiểu Âu;Dương Phục;n
シャツ;シャツ;áo sơ mi;;n
ワイシャツ;ワイシャツ;áo sơ mi trắng;;n
セーター;セーター;áo len;;n
上着;うわぎ;áo khoác;Thượng Trước;n
コート;コート;áo khoác dài;;n
ズボン;ズボン;quần dài;;n
スカート;スカート;váy;;n
靴;くつ;giày;Ngoa;n
靴下;くつした;tất;Ngoa Hạ;n
帽子;ぼうし;cái mũ;Mạo Tử;n
眼鏡;めがね;kính mắt;Nhãn Kính;n
ネクタイ;ネクタイ;cà vạt;;n
ポケット;ポケット;túi áo;;n
ボタン;ボタン;cúc áo; nút bấm;;n
着る;きる;mặc (áo);Trước;v
履く;はく;mặc, đi (quần, giày);Lý;v
被る;かぶる;đội (mũ);Bị;v
脱ぐ;ぬぐ;cởi;Thoát;v
色;いろ;màu sắc;Sắc;n
赤い;あかい;màu đỏ;Xích;a
青い;あおい;màu xanh;Thanh;a
白い;しろい;màu trắng;Bạch;a
黒い;くろい;màu đen;Hắc;a
黄色い;きいろい;màu vàng;Hoàng Sắc;a
茶色;ちゃいろ;màu nâu;Trà Sắc;n
緑;みどり;màu xanh lá;Lục;n
`],
['town', 'Thành phố & nơi chốn', 'town', `
店;みせ;cửa hàng;Điếm;n
駅;えき;nhà ga;Dịch;n
所;ところ;nơi, chỗ;Sở;n
町;まち;thị trấn, phố;Đinh;n
国;くに;đất nước;Quốc;n
外国;がいこく;nước ngoài;Ngoại Quốc;n
日本;にほん;Nhật Bản;Nhật Bản;n
銀行;ぎんこう;ngân hàng;Ngân Hành;n
郵便局;ゆうびんきょく;bưu điện;Bưu Tiện Cục;n
病院;びょういん;bệnh viện;Bệnh Viện;n
大使館;たいしかん;đại sứ quán;Đại Sứ Quán;n
公園;こうえん;công viên;Công Viên;n
映画館;えいがかん;rạp chiếu phim;Ánh Họa Quán;n
デパート;デパート;cửa hàng bách hóa;;n
スーパー;スーパー;siêu thị;;n
本屋;ほんや;hiệu sách;Bản Ốc;n
花屋;はなや;cửa hàng hoa;Hoa Ốc;n
八百屋;やおや;cửa hàng rau quả;Bát Bách Ốc;n
肉屋;にくや;cửa hàng thịt;Nhục Ốc;n
パン屋;パンや;tiệm bánh mì;Ốc;n
ホテル;ホテル;khách sạn;;n
交番;こうばん;đồn cảnh sát;Giao Phiên;n
プール;プール;bể bơi;;n
建物;たてもの;tòa nhà;Kiến Vật;n
ビル;ビル;tòa nhà cao tầng;;n
エレベーター;エレベーター;thang máy;;n
入口;いりぐち;lối vào;Nhập Khẩu;n
出口;でぐち;lối ra;Xuất Khẩu;n
受付;うけつけ;quầy lễ tân;Thụ Phó;n
お金;おかね;tiền;Kim;n
円;えん;yên (tiền Nhật);Viên;n
買い物;かいもの;mua sắm;Mãi Vật;n
切符;きっぷ;vé;Thiết Phù;n
パーティー;パーティー;bữa tiệc;;n
大勢;おおぜい;đông người;Đại Thế;n
近く;ちかく;gần, chỗ gần;Cận;n
隣;となり;bên cạnh;Lân;n
側;そば;bên cạnh, gần;Trắc;n
`],
['transport', 'Giao thông & phương hướng', 'train', `
電車;でんしゃ;tàu điện;Điện Xa;n
車;くるま;ô tô;Xa;n
自動車;じどうしゃ;xe ô tô;Tự Động Xa;n
自転車;じてんしゃ;xe đạp;Tự Chuyển Xa;n
バス;バス;xe buýt;;n
タクシー;タクシー;taxi;;n
地下鉄;ちかてつ;tàu điện ngầm;Địa Hạ Thiết;n
飛行機;ひこうき;máy bay;Phi Hành Cơ;n
空港;くうこう;sân bay;Không Cảng;n
船;ふね;tàu thủy;Thuyền;n
道;みち;con đường;Đạo;n
道路;どうろ;đường phố;Đạo Lộ;n
交差点;こうさてん;ngã tư;Giao Sai Điểm;n
信号;しんごう;đèn giao thông;Tín Hiệu;n
角;かど;góc phố;Giác;n
橋;はし;cây cầu;Kiều;n
旅行;りょこう;du lịch;Lữ Hành;n
荷物;にもつ;hành lý;Hà Vật;n
上;うえ;trên;Thượng;n
下;した;dưới;Hạ;n
前;まえ;trước;Tiền;n
後ろ;うしろ;sau, đằng sau;Hậu;n
右;みぎ;bên phải;Hữu;n
左;ひだり;bên trái;Tả;n
中;なか;bên trong;Trung;n
外;そと;bên ngoài;Ngoại;n
間;あいだ;giữa;Gian;n
横;よこ;bên cạnh, chiều ngang;Hoành;n
向こう;むこう;phía bên kia;Hướng;n
東;ひがし;phía đông;Đông;n
西;にし;phía tây;Tây;n
南;みなみ;phía nam;Nam;n
北;きた;phía bắc;Bắc;n
`],
['time', 'Thời gian', 'clock', `
今日;きょう;hôm nay;Kim Nhật;t
明日;あした;ngày mai;Minh Nhật;t
昨日;きのう;hôm qua;Tạc Nhật;t
毎日;まいにち;mỗi ngày;Mỗi Nhật;t
時間;じかん;thời gian;Thời Gian;t
月;つき;mặt trăng; tháng;Nguyệt;t
今;いま;bây giờ;Kim;t
時;とき;khi, lúc;Thời;t
朝;あさ;buổi sáng;Triêu;t
昼;ひる;buổi trưa;Trú;t
夜;よる;buổi tối, ban đêm;Dạ;t
次;つぎ;tiếp theo;Thứ;t
一昨日;おととい;hôm kia;Nhất Tạc Nhật;t
明後日;あさって;ngày kia;Minh Hậu Nhật;t
今朝;けさ;sáng nay;Kim Triêu;t
今晩;こんばん;tối nay;Kim Vãn;t
晩;ばん;buổi tối;Vãn;t
夕方;ゆうがた;chiều tối;Tịch Phương;t
午前;ごぜん;buổi sáng (AM);Ngọ Tiền;t
午後;ごご;buổi chiều (PM);Ngọ Hậu;t
毎朝;まいあさ;mỗi sáng;Mỗi Triêu;t
毎晩;まいばん;mỗi tối;Mỗi Vãn;t
週;しゅう;tuần;Chu;t
今週;こんしゅう;tuần này;Kim Chu;t
先週;せんしゅう;tuần trước;Tiên Chu;t
来週;らいしゅう;tuần sau;Lai Chu;t
毎週;まいしゅう;mỗi tuần;Mỗi Chu;t
週末;しゅうまつ;cuối tuần;Chu Mạt;t
今月;こんげつ;tháng này;Kim Nguyệt;t
先月;せんげつ;tháng trước;Tiên Nguyệt;t
来月;らいげつ;tháng sau;Lai Nguyệt;t
毎月;まいつき;mỗi tháng;Mỗi Nguyệt;t
年;とし;năm; tuổi;Niên;t
今年;ことし;năm nay;Kim Niên;t
去年;きょねん;năm ngoái;Khứ Niên;t
来年;らいねん;năm sau;Lai Niên;t
毎年;まいとし;mỗi năm;Mỗi Niên;t
日曜日;にちようび;Chủ nhật;Nhật Diệu Nhật;t
月曜日;げつようび;thứ Hai;Nguyệt Diệu Nhật;t
火曜日;かようび;thứ Ba;Hỏa Diệu Nhật;t
水曜日;すいようび;thứ Tư;Thủy Diệu Nhật;t
木曜日;もくようび;thứ Năm;Mộc Diệu Nhật;t
金曜日;きんようび;thứ Sáu;Kim Diệu Nhật;t
土曜日;どようび;thứ Bảy;Thổ Diệu Nhật;t
何曜日;なんようび;thứ mấy;Hà Diệu Nhật;t
誕生日;たんじょうび;sinh nhật;Đản Sinh Nhật;t
半;はん;rưỡi, một nửa;Bán;t
後;あと;sau (thời gian);Hậu;t
初め;はじめ;lúc đầu;Sơ;t
最後;さいご;cuối cùng;Tối Hậu;t
`],
['nature', 'Thiên nhiên, thời tiết & con vật', 'mountain', `
山;やま;núi;Sơn;n
川;かわ;sông;Xuyên;n
木;き;cây;Mộc;n
天気;てんき;thời tiết;Thiên Khí;n
雨;あめ;mưa;Vũ;n
犬;いぬ;con chó;Khuyển;n
猫;ねこ;con mèo;Miêu;n
空;そら;bầu trời;Không;n
海;うみ;biển;Hải;n
池;いけ;cái ao;Trì;n
花;はな;hoa;Hoa;n
森;もり;rừng;Sâm;n
島;しま;hòn đảo;Đảo;n
雪;ゆき;tuyết;Tuyết;n
風;かぜ;gió;Phong;n
雲;くも;mây;Vân;n
晴れ;はれ;trời nắng;Tình;n
曇り;くもり;trời nhiều mây;Đàm;n
日;ひ;mặt trời; ngày;Nhật;n
春;はる;mùa xuân;Xuân;t
夏;なつ;mùa hè;Hạ;t
秋;あき;mùa thu;Thu;t
冬;ふゆ;mùa đông;Đông;t
動物;どうぶつ;động vật;Động Vật;n
鳥;とり;con chim;Điểu;n
牛;うし;con bò;Ngưu;n
馬;うま;con ngựa;Mã;n
豚;ぶた;con lợn;Đồn;n
晴れる;はれる;trời nắng ráo;Tình;v
曇る;くもる;trời âm u;Đàm;v
降る;ふる;rơi (mưa, tuyết);Giáng;v
吹く;ふく;thổi;Xuy;v
暑い;あつい;nóng (thời tiết);Thử;a
寒い;さむい;lạnh (thời tiết);Hàn;a
暖かい;あたたかい;ấm áp;Noãn;a
涼しい;すずしい;mát mẻ;Lương;a
`],
['numbers', 'Số đếm & cách đếm', 'counter', `
一;いち;một;Nhất;x
二;に;hai;Nhị;x
三;さん;ba;Tam;x
四;よん;bốn;Tứ;x
五;ご;năm;Ngũ;x
六;ろく;sáu;Lục;x
七;なな;bảy;Thất;x
八;はち;tám;Bát;x
九;きゅう;chín;Cửu;x
十;じゅう;mười;Thập;x
百;ひゃく;một trăm;Bách;x
千;せん;một nghìn;Thiên;x
万;まん;mười nghìn;Vạn;x
零;ゼロ;số không;Linh;x
一つ;ひとつ;một cái;Nhất;x
二つ;ふたつ;hai cái;Nhị;x
三つ;みっつ;ba cái;Tam;x
四つ;よっつ;bốn cái;Tứ;x
五つ;いつつ;năm cái;Ngũ;x
六つ;むっつ;sáu cái;Lục;x
七つ;ななつ;bảy cái;Thất;x
八つ;やっつ;tám cái;Bát;x
九つ;ここのつ;chín cái;Cửu;x
十;とお;mười cái;Thập;x
一人;ひとり;một người;Nhất Nhân;x
二人;ふたり;hai người;Nhị Nhân;x
一日;ついたち;ngày mùng một;Nhất Nhật;t
二日;ふつか;ngày mùng hai; hai ngày;Nhị Nhật;t
三日;みっか;ngày mùng ba; ba ngày;Tam Nhật;t
四日;よっか;ngày mùng bốn;Tứ Nhật;t
五日;いつか;ngày mùng năm;Ngũ Nhật;t
六日;むいか;ngày mùng sáu;Lục Nhật;t
七日;なのか;ngày mùng bảy;Thất Nhật;t
八日;ようか;ngày mùng tám;Bát Nhật;t
九日;ここのか;ngày mùng chín;Cửu Nhật;t
十日;とおか;ngày mùng mười;Thập Nhật;t
二十日;はつか;ngày 20;Nhị Thập Nhật;t
いくつ;いくつ;bao nhiêu cái; mấy tuổi;;x
いくら;いくら;bao nhiêu tiền;;x
何人;なんにん;mấy người;Hà Nhân;x
何時;なんじ;mấy giờ;Hà Thời;x
番号;ばんごう;số (thứ tự);Phiên Hiệu;n
〜枚;〜まい;… tờ, tấm (vật mỏng);Mai;x
〜本;〜ほん;… cái (vật dài);Bản;x
〜台;〜だい;… chiếc (máy, xe);Đài;x
〜冊;〜さつ;… quyển;Sách;x
〜匹;〜ひき;… con (con vật nhỏ);Thất;x
〜杯;〜はい;… cốc, bát;Bôi;x
〜階;〜かい;tầng …;Giai;x
〜回;〜かい;… lần;Hồi;x
〜歳;〜さい;… tuổi;Tuế;x
〜個;〜こ;… cái (vật nhỏ);Cá;x
〜番;〜ばん;số …, thứ …;Phiên;x
〜分;〜ふん;… phút;Phân;x
〜時;〜じ;… giờ;Thời;x
〜時間;〜じかん;… tiếng (đồng hồ);Thời Gian;x
〜月;〜がつ;tháng …;Nguyệt;x
〜ヶ月;〜かげつ;… tháng (khoảng);Nguyệt;x
〜年;〜ねん;năm …;Niên;x
〜人;〜にん;… người;Nhân;x
〜度;〜ど;… lần; … độ;Độ;x
〜グラム;〜グラム;… gam;;x
〜キロ;〜キロ;… cân; … km;;x
〜メートル;〜メートル;… mét;;x
`],
['hobby', 'Sở thích & giải trí', 'music', `
趣味;しゅみ;sở thích;Thú Vị;n
音楽;おんがく;âm nhạc;Âm Nhạc;n
歌;うた;bài hát;Ca;n
映画;えいが;phim điện ảnh;Ánh Họa;n
絵;え;bức tranh;Hội;n
スポーツ;スポーツ;thể thao;;n
サッカー;サッカー;bóng đá;;n
テニス;テニス;quần vợt;;n
野球;やきゅう;bóng chày;Dã Cầu;n
ゲーム;ゲーム;trò chơi;;n
ギター;ギター;đàn ghi-ta;;n
ピアノ;ピアノ;đàn piano;;n
レコード;レコード;đĩa hát;;n
テープ;テープ;băng (cát-xét);;n
話;はなし;câu chuyện;Thoại;n
散歩;さんぽ;đi dạo;Tản Bộ;n
旅行する;りょこうする;đi du lịch;Lữ Hành;v
泳ぐ;およぐ;bơi;Vịnh;v
歌う;うたう;hát;Ca;v
弾く;ひく;chơi (đàn);Đàn;v
遊ぶ;あそぶ;chơi;Du;v
好き;すき;thích;Hảo;a
嫌い;きらい;ghét;Hiềm;a
大好き;だいすき;rất thích;Đại Hảo;a
大嫌い;だいきらい;rất ghét;Đại Hiềm;a
上手;じょうず;giỏi;Thượng Thủ;a
下手;へた;kém;Hạ Thủ;a
`],
['verb1', 'Động từ thường ngày 1', 'eat', `
食べる;たべる;ăn;Thực;v
飲む;のむ;uống;Ẩm;v
行く;いく;đi;Hành;v
来る;くる;đến;Lai;v
見る;みる;nhìn, xem;Kiến;v
聞く;きく;nghe, hỏi;Văn;v
話す;はなす;nói chuyện;Thoại;v
読む;よむ;đọc;Độc;v
書く;かく;viết;Thư;v
買う;かう;mua;Mãi;v
する;する;làm;;v
起きる;おきる;thức dậy;Khởi;v
寝る;ねる;ngủ;Tẩm;v
帰る;かえる;trở về;Quy;v
休む;やすむ;nghỉ ngơi;Hưu;v
働く;はたらく;làm việc;Động;v
勉強する;べんきょうする;học;Miễn Cường;v
洗う;あらう;rửa;Tẩy;v
浴びる;あびる;tắm (vòi sen);Dục;v
入る;はいる;vào; tắm (bồn);Nhập;v
出る;でる;ra, rời;Xuất;v
出かける;でかける;ra ngoài;Xuất;v
会う;あう;gặp;Hội;v
言う;いう;nói;Ngôn;v
思う;おもう;nghĩ;Tư;v
分かる;わかる;hiểu;Phân;v
知る;しる;biết;Tri;v
教える;おしえる;dạy; chỉ cho;Giáo;v
習う;ならう;học (từ ai đó);Tập;v
覚える;おぼえる;nhớ, thuộc;Giác;v
忘れる;わすれる;quên;Vong;v
答える;こたえる;trả lời;Đáp;v
聞こえる;きこえる;nghe thấy;Văn;v
見える;みえる;nhìn thấy;Kiến;v
見せる;みせる;cho xem;Kiến;v
作る;つくる;làm, nấu;Tác;v
使う;つかう;sử dụng;Sử;v
撮る;とる;chụp (ảnh);Toát;v
取る;とる;lấy;Thủ;v
置く;おく;đặt, để;Trí;v
持つ;もつ;cầm, có;Trì;v
待つ;まつ;chờ đợi;Đãi;v
貸す;かす;cho mượn;Thải;v
借りる;かりる;mượn;Tá;v
返す;かえす;trả lại;Phản;v
あげる;あげる;cho, tặng;;v
もらう;もらう;nhận;;v
売る;うる;bán;Mại;v
払う;はらう;trả tiền;Phất;v
送る;おくる;gửi; tiễn;Tống;v
`],
['verb2', 'Động từ thường ngày 2', 'run', `
歩く;あるく;đi bộ;Bộ;v
走る;はしる;chạy;Tẩu;v
飛ぶ;とぶ;bay;Phi;v
乗る;のる;lên (xe, tàu);Thừa;v
降りる;おりる;xuống (xe, tàu);Giáng;v
渡る;わたる;băng qua;Độ;v
曲がる;まがる;rẽ;Khúc;v
着く;つく;đến nơi;Trước;v
止まる;とまる;dừng lại;Chỉ;v
住む;すむ;sống, cư trú;Trú;v
立つ;たつ;đứng;Lập;v
座る;すわる;ngồi;Tọa;v
開ける;あける;mở;Khai;v
閉める;しめる;đóng;Bế;v
開く;あく;(cái gì) mở;Khai;v
閉まる;しまる;(cái gì) đóng;Bế;v
付ける;つける;bật (đèn, máy);Phó;v
消す;けす;tắt; xóa;Tiêu;v
始まる;はじまる;bắt đầu;Thủy;v
終わる;おわる;kết thúc;Chung;v
並ぶ;ならぶ;xếp hàng;Tịnh;v
並べる;ならべる;xếp, bày;Tịnh;v
入れる;いれる;cho vào;Nhập;v
出す;だす;lấy ra; gửi;Xuất;v
押す;おす;ấn, đẩy;Áp;v
引く;ひく;kéo;Dẫn;v
切る;きる;cắt;Thiết;v
貼る;はる;dán;Thiếp;v
掛ける;かける;treo; gọi (điện); đeo (kính);Quải;v
締める;しめる;thắt (cà vạt);Đế;v
磨く;みがく;đánh (răng);Ma;v
掃除する;そうじする;dọn dẹp;Tảo Trừ;v
洗濯する;せんたくする;giặt giũ;Tẩy Trạc;v
料理する;りょうりする;nấu ăn;Liệu Lý;v
散歩する;さんぽする;đi dạo;Tản Bộ;v
結婚する;けっこんする;kết hôn;Kết Hôn;v
電話する;でんわする;gọi điện;Điện Thoại;v
質問する;しつもんする;hỏi;Chất Vấn;v
練習する;れんしゅうする;luyện tập;Luyện Tập;v
頼む;たのむ;nhờ;Lại;v
呼ぶ;よぶ;gọi;Hô;v
死ぬ;しぬ;chết;Tử;v
生まれる;うまれる;được sinh ra;Sinh;v
困る;こまる;gặp rắc rối;Khốn;v
疲れる;つかれる;mệt;Bì;v
始める;はじめる;bắt đầu (việc gì);Thủy;v
要る;いる;cần;Yếu;v
吸う;すう;hút (thuốc); hít;Hấp;v
咲く;さく;(hoa) nở;Tiếu;v
鳴く;なく;(chim, thú) kêu;Minh;v
違う;ちがう;khác; sai;Vi;v
かかる;かかる;mất (thời gian, tiền);;v
差す;さす;giương (ô);Sai;v
勤める;つとめる;làm việc cho (công ty);Cần;v
いる;いる;có, ở (người, con vật);;v
ある;ある;có, ở (đồ vật);;v
なる;なる;trở thành;;v
できる;できる;có thể; làm xong;;v
`],
['adj', 'Tính từ đuôi い', 'big', `
大きい;おおきい;to, lớn;Đại;a
小さい;ちいさい;nhỏ, bé;Tiểu;a
新しい;あたらしい;mới;Tân;a
古い;ふるい;cũ;Cổ;a
高い;たかい;cao; đắt;Cao;a
安い;やすい;rẻ;An;a
低い;ひくい;thấp;Đê;a
長い;ながい;dài;Trường;a
短い;みじかい;ngắn;Đoản;a
広い;ひろい;rộng;Quảng;a
狭い;せまい;hẹp, chật;Hiệp;a
重い;おもい;nặng;Trọng;a
軽い;かるい;nhẹ;Khinh;a
多い;おおい;nhiều;Đa;a
少ない;すくない;ít;Thiểu;a
いい;いい;tốt;;a
悪い;わるい;xấu, tồi;Ác;a
良い;よい;tốt;Lương;a
早い;はやい;sớm;Tảo;a
速い;はやい;nhanh;Tốc;a
遅い;おそい;muộn; chậm;Trì;a
近い;ちかい;gần;Cận;a
遠い;とおい;xa;Viễn;a
熱い;あつい;nóng (đồ vật);Nhiệt;a
冷たい;つめたい;lạnh (đồ vật);Lãnh;a
温い;ぬるい;âm ấm, nguội;Ôn;a
明るい;あかるい;sáng sủa;Minh;a
暗い;くらい;tối;Ám;a
強い;つよい;mạnh;Cường;a
弱い;よわい;yếu;Nhược;a
太い;ふとい;béo, mập; to (sợi);Thái;a
細い;ほそい;gầy, mảnh;Tế;a
厚い;あつい;dày;Hậu;a
薄い;うすい;mỏng; nhạt;Bạc;a
丸い;まるい;tròn;Hoàn;a
若い;わかい;trẻ;Nhược;a
忙しい;いそがしい;bận rộn;Mang;a
楽しい;たのしい;vui vẻ;Lạc;a
面白い;おもしろい;thú vị;Diện Bạch;a
つまらない;つまらない;chán;;a
易しい;やさしい;dễ;Dị;a
優しい;やさしい;hiền, tốt bụng;Ưu;a
難しい;むずかしい;khó;Nan;a
可愛い;かわいい;dễ thương;Khả Ái;a
汚い;きたない;bẩn;Ô;a
うるさい;うるさい;ồn ào;;a
欲しい;ほしい;muốn có;Dục;a
危ない;あぶない;nguy hiểm;Nguy;a
`],
['adjna', 'Tính từ đuôi な', 'star', `
綺麗;きれい;đẹp; sạch;Khỉ Lệ;a
静か;しずか;yên tĩnh;Tĩnh;a
賑やか;にぎやか;náo nhiệt;Chẩn;a
有名;ゆうめい;nổi tiếng;Hữu Danh;a
親切;しんせつ;tốt bụng, tử tế;Thân Thiết;a
暇;ひま;rảnh rỗi;Hạ;a
便利;べんり;tiện lợi;Tiện Lợi;a
大切;たいせつ;quan trọng;Đại Thiết;a
大丈夫;だいじょうぶ;không sao;Đại Trượng Phu;a
大変;たいへん;vất vả; rất;Đại Biến;a
丈夫;じょうぶ;chắc chắn, khỏe;Trượng Phu;a
立派;りっぱ;tuyệt vời, oai;Lập Phái;a
いろいろ;いろいろ;nhiều loại;;a
同じ;おなじ;giống nhau;Đồng;a
嫌;いや;không thích, khó chịu;Hiềm;a
結構;けっこう;tốt rồi, đủ rồi; khá;Kết Cấu;a
ハンサム;ハンサム;đẹp trai;;a
`],
['words', 'Từ để hỏi, chỉ thị & phó từ', 'question', `
何;なに;cái gì;Hà;x
どこ;どこ;ở đâu;;x
いつ;いつ;khi nào;;x
どう;どう;thế nào;;x
どうして;どうして;tại sao;;x
なぜ;なぜ;tại sao;;x
どれ;どれ;cái nào;;x
どの;どの;… nào;;x
どんな;どんな;như thế nào, loại gì;;x
どちら;どちら;phía nào, cái nào (lịch sự);;x
どっち;どっち;cái nào (thân mật);;x
どのくらい;どのくらい;khoảng bao lâu, bao nhiêu;;x
これ;これ;cái này;;x
それ;それ;cái đó;;x
あれ;あれ;cái kia;;x
この;この;… này;;x
その;その;… đó;;x
あの;あの;… kia;;x
ここ;ここ;chỗ này;;x
そこ;そこ;chỗ đó;;x
あそこ;あそこ;chỗ kia;;x
こちら;こちら;phía này (lịch sự);;x
そちら;そちら;phía đó (lịch sự);;x
あちら;あちら;phía kia (lịch sự);;x
こんな;こんな;như thế này;;x
そんな;そんな;như thế đó;;x
あんな;あんな;như thế kia;;x
こう;こう;như thế này;;x
とても;とても;rất;;x
よく;よく;thường; tốt, giỏi;;x
少し;すこし;một chút;Thiểu;x
たくさん;たくさん;nhiều;;x
全部;ぜんぶ;toàn bộ;Toàn Bộ;x
大体;だいたい;đại khái;Đại Thể;x
多分;たぶん;có lẽ;Đa Phân;x
きっと;きっと;chắc chắn;;x
もちろん;もちろん;tất nhiên;;x
本当;ほんとう;thật sự;Bản Đương;x
本当に;ほんとうに;thật là;Bản Đương;x
いつも;いつも;luôn luôn;;x
時々;ときどき;thỉnh thoảng;Thời;x
たいてい;たいてい;thường thì;;x
あまり;あまり;không … lắm;;x
全然;ぜんぜん;hoàn toàn không;Toàn Nhiên;x
まだ;まだ;vẫn, chưa;;x
もう;もう;đã, rồi; thêm;;x
すぐ;すぐ;ngay lập tức;;x
ゆっくり;ゆっくり;thong thả, chậm;;x
一緒に;いっしょに;cùng nhau;Nhất Tự;x
一番;いちばん;nhất, số một;Nhất Phiên;x
初めて;はじめて;lần đầu tiên;Sơ;x
また;また;lại;;x
もっと;もっと;hơn nữa;;x
ちょうど;ちょうど;vừa đúng;;x
だんだん;だんだん;dần dần;;x
まっすぐ;まっすぐ;thẳng;;x
先に;さきに;trước;Tiên;x
ゆうべ;ゆうべ;tối qua;;t
でも;でも;nhưng;;x
しかし;しかし;tuy nhiên;;x
そして;そして;và rồi;;x
それから;それから;sau đó;;x
だから;だから;vì vậy;;x
ほか;ほか;khác;;x
方;ほう;phía, hướng; (so sánh) … hơn;Phương;x
〜ぐらい;〜ぐらい;khoảng …;;x
〜だけ;〜だけ;chỉ …;;x
〜たち;〜たち;các …, những …;;x
〜屋;〜や;cửa hàng …;Ốc;x
〜語;〜ご;tiếng …;Ngữ;x
〜人;〜じん;người nước …;Nhân;x
〜中;〜じゅう;suốt …;Trung;x
`],
]

// Chuyển kana sang romaji (Hepburn, trường âm viết đôi nguyên âm)
const R1 = { あ: 'a', い: 'i', う: 'u', え: 'e', お: 'o', か: 'ka', き: 'ki', く: 'ku', け: 'ke', こ: 'ko', さ: 'sa', し: 'shi', す: 'su', せ: 'se', そ: 'so', た: 'ta', ち: 'chi', つ: 'tsu', て: 'te', と: 'to', な: 'na', に: 'ni', ぬ: 'nu', ね: 'ne', の: 'no', は: 'ha', ひ: 'hi', ふ: 'fu', へ: 'he', ほ: 'ho', ま: 'ma', み: 'mi', む: 'mu', め: 'me', も: 'mo', や: 'ya', ゆ: 'yu', よ: 'yo', ら: 'ra', り: 'ri', る: 'ru', れ: 're', ろ: 'ro', わ: 'wa', を: 'o', ん: 'n', が: 'ga', ぎ: 'gi', ぐ: 'gu', げ: 'ge', ご: 'go', ざ: 'za', じ: 'ji', ず: 'zu', ぜ: 'ze', ぞ: 'zo', だ: 'da', ぢ: 'ji', づ: 'zu', で: 'de', ど: 'do', ば: 'ba', び: 'bi', ぶ: 'bu', べ: 'be', ぼ: 'bo', ぱ: 'pa', ぴ: 'pi', ぷ: 'pu', ぺ: 'pe', ぽ: 'po', ぁ: 'a', ぃ: 'i', ぅ: 'u', ぇ: 'e', ぉ: 'o', ゔ: 'vu' }
const Y = { ゃ: 'a', ゅ: 'u', ょ: 'o' }
export function toRomaji(str) {
  const s = [...str].map(c => { const n = c.charCodeAt(0); return n >= 0x30a1 && n <= 0x30f6 ? String.fromCharCode(n - 0x60) : c })
  let out = ''
  for (let i = 0; i < s.length; i++) {
    const c = s[i], nx = s[i + 1]
    if (c === 'っ') { const r = R1[nx] ? (Y[s[i + 2]] ? R1[nx] : R1[nx]) : ''; out += r ? (r.startsWith('ch') ? 't' : r[0]) : ''; continue }
    if (c === 'ー') { out += out.slice(-1); continue }
    if (Y[nx] && R1[c]) { const b = R1[c]; out += (b === 'shi' ? 'sh' : b === 'chi' ? 'ch' : b === 'ji' ? 'j' : b.slice(0, -1) + 'y') + Y[nx]; i++; continue }
    if (c === 'ん' && /^[aiueoy]/.test(R1[nx] || '')) { out += "n'"; continue }
    if ((c === 'ぁ' || c === 'ぃ' || c === 'ぇ' || c === 'ぉ') && out) { out = out.replace(/[aiueo]$/, '') + R1[c]; continue }
    out += R1[c] ?? c
  }
  return out.replace(/〜/g, '~')
}
// Trường âm viết kiểu ō, ū như phần còn lại của app (động từ giữ nguyên vì う là đuôi động từ)
const macron = (r, t) => t === 'v' ? r : r.replace(/ou|oo/g, 'ō').replace(/uu/g, 'ū').replace(/aa/g, 'ā').replace(/ii(?!$)/g, 'ī').replace(/ee/g, 'ē')
export const parseTopics = () => TOPICS.flatMap(([tp, name, icon, body]) => body.trim().split('\n').map(l => { const f = l.split(';'), k = f[0], h = f[1], t = f[f.length - 1], hv = f[f.length - 2], m = f.slice(2, -2).join(';'); return { tp, k: k === h ? '' : k, h, m, hv, t, r: macron(toRomaji(h).replace(/ha$/, t === 'c' ? 'wa' : 'ha'), t) } }))

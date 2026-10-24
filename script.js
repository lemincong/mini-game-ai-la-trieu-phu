/**
 * script.js — Ai Là Triệu Phú
 *
 * Format file câu hỏi (.txt):
 *   Mỗi dòng = 1 câu, các trường cách nhau bằng dấu |
 *   Câu hỏi | Đáp án A | Đáp án B | Đáp án C | Đáp án D | Đáp án đúng (A/B/C/D)
 *   Dòng trống và dòng bắt đầu bằng # sẽ bị bỏ qua.
 *
 * Thang tiền thưởng:
 *   Câu 1-4, 6-9, 11-14 : 100 VNĐ / câu đúng
 *   Mốc câu 5, 10, 15   : 500 VNĐ
 *
 * Mốc an toàn (safe level):
 *   Thua trước câu 5  → nhận 0 VNĐ
 *   Thua câu 6-9      → nhận 500 VNĐ  (đã qua mốc 5)
 *   Thua câu 11-14    → nhận 500 VNĐ  (đã qua mốc 10)
 */

'use strict';

/* ================================================================
   1. DỮ LIỆU — CÂU HỎI MẶC ĐỊNH (15 câu)
================================================================ */
const DEFAULT_QUESTIONS = [
  { q: 'Đội tuyển bóng đá nam quốc gia nào giành chức vô địch FIFA World Cup năm 2022 tại Qatar?', a: 'Pháp', b: 'Argentina', c: 'Brazil', d: 'Croatia', ans: 'B' },
  { q: 'Cầu thủ nào giữ kỷ lục giành nhiều danh hiệu Quả bóng vàng (Ballon d\'Or) nhất lịch sử bóng đá thế giới?', a: 'Cristiano Ronaldo', b: 'Michel Platini', c: 'Lionel Messi', d: 'Johan Cruyff', ans: 'C' },
  { q: 'Đội tuyển bóng đá nam Việt Nam lần đầu tiên vô địch giải AFF Cup vào năm nào?', a: '2008', b: '2018', c: '2022', d: '1998', ans: 'A' },
  { q: 'Huấn luyện viên trưởng dẫn dắt Đội tuyển Việt Nam giành ngôi Á quân U23 châu Á năm 2018 tại Thường Châu là ai?', a: 'Henrique Calisto', b: 'Park Hang-seo', c: 'Philippe Troussier', d: 'Kim Sang-sik', ans: 'B' },
  { q: 'Câu lạc bộ bóng đá nào giàu thành tích nhất lịch sử giải đấu UEFA Champions League (Cúp C1 châu Âu)?', a: 'AC Milan', b: 'Bayern Munich', c: 'Liverpool', d: 'Real Madrid', ans: 'D' },
  { q: 'Mỗi hiệp đấu chính thức của một trận bóng đá 11 người tiêu chuẩn kéo dài bao nhiêu phút (không tính bù giờ)?', a: '40 phút', b: '45 phút', c: '50 phút', d: '35 phút', ans: 'B' },
  { q: 'Sân vận động Old Trafford là sân nhà của câu lạc bộ bóng đá nào tại giải Ngoại hạng Anh?', a: 'Manchester City', b: 'Arsenal', c: 'Manchester United', d: 'Chelsea', ans: 'C' },
  { q: 'Quốc gia nào nắm giữ kỷ lục 5 lần vô địch giải bóng đá vô địch thế giới (FIFA World Cup)?', a: 'Đức', b: 'Ý', c: 'Argentina', d: 'Brazil', ans: 'D' },
  { q: 'Trong môn bóng đá, chấm phạt đền (Penalty) cách đường vôi khung thành bao nhiêu mét?', a: '9 mét', b: '11 mét', c: '13 mét', d: '16.5 mét', ans: 'B' },
  { q: 'Cầu thủ nào của Đội tuyển Việt Nam đã ghi bàn thắng quyết định ở trận chung kết lượt về AFF Cup 2008 trên sân Mỹ Đình?', a: 'Nguyễn Quang Hải', b: 'Lê Công Vinh', c: 'Nguyễn Anh Đức', d: 'Phạm Tuấn Hải', ans: 'B' },
  { q: 'Giải vô địch bóng đá châu Âu cấp đội tuyển quốc gia (UEFA Euro) thông thường được tổ chức định kỳ mấy năm một lần?', a: '2 năm', b: '3 năm', c: '4 năm', d: '5 năm', ans: 'C' },
  { q: 'Đội tuyển quốc gia nào đã lên ngôi vô địch giải bóng đá Euro 2024 tổ chức tại Đức?', a: 'Anh', b: 'Pháp', c: 'Tây Ban Nha', d: 'Đức', ans: 'C' },
  { q: 'Trong bóng đá, một cầu thủ ghi được 3 bàn thắng trong cùng một trận đấu được gọi bằng thuật ngữ nào?', a: 'Cú đúp', b: 'Hat-trick', c: 'Poker', d: 'Repoker', ans: 'B' },
  { q: 'Cầu thủ Nguyễn Quang Hải từng lập siêu phẩm đá phạt có biệt danh \'Cầu vồng trong tuyết\' vào lưới đội tuyển U23 nào năm 2018?', a: 'U23 Qatar', b: 'U23 Iraq', c: 'U23 Uzbekistan', d: 'U23 Hàn Quốc', ans: 'C' },
  { q: 'Sân vận động Quốc gia Mỹ Đình (Hà Nội) được khánh thành và đưa vào sử dụng từ năm nào để phục vụ SEA Games 22?', a: '2001', b: '2003', c: '2005', d: '2007', ans: 'B' },
  { q: 'Câu lạc bộ bóng đá Barcelona có sân nhà truyền thống mang tên là gì?', a: 'Santiago Bernabéu', b: 'Camp Nou', c: 'Wanda Metropolitano', d: 'Mestalla', ans: 'B' },
  { q: 'Huyền thoại bóng đá Pelé là người mang quốc tịch của quốc gia nào?', a: 'Argentina', b: 'Bồ Đào Nha', c: 'Brazil', d: 'Uruguay', ans: 'C' },
  { q: 'Đội tuyển bóng đá nữ Việt Nam lần đầu tiên giành quyền tham dự Vòng chung kết FIFA World Cup nữ vào năm nào?', a: '2015', b: '2019', c: '2023', d: '2021', ans: 'C' },
  { q: 'Theo luật bóng đá FIFA, mỗi đội bóng trên sân 11 người tối thiểu phải còn bao nhiêu cầu thủ thì trận đấu mới được tiếp tục?', a: '6 cầu thủ', b: '7 cầu thủ', c: '8 cầu thủ', d: '9 cầu thủ', ans: 'B' },
  { q: 'Số nguyên tố chẵn duy nhất trong tập hợp các số tự nhiên là số nào?', a: '0', b: '2', c: '4', d: '6', ans: 'B' },
  { q: 'Tổng số đo ba góc trong một tam giác phẳng theo hình học Euclid luôn bằng bao nhiêu độ?', a: '90 độ', b: '180 độ', c: '270 độ', d: '360 độ', ans: 'B' },
  { q: 'Hằng số toán học Pi (tỷ số giữa chu vi và đường kính của một đường tròn) có giá trị xấp xỉ bằng bao nhiêu?', a: '2.718', b: '3.1416', c: '1.618', d: '1.414', ans: 'B' },
  { q: 'Trong tam giác vuông, định lý nào phát biểu rằng bình phương cạnh huyền bằng tổng bình phương hai cạnh góc vuông?', a: 'Định lý Thales', b: 'Định lý Viète', c: 'Định lý Pythagore', d: 'Định lý Fermat', ans: 'C' },
  { q: 'Đạo hàm của hàm số f(x) = x² theo biến x là biểu thức nào sau đây?', a: 'x', b: '2x', c: 'x³/3', d: '2', ans: 'B' },
  { q: 'Trong chương trình Giải tích, nguyên hàm của hàm số f(x) = cos(x) là hàm số nào?', a: '-sin(x) + C', b: 'sin(x) + C', c: 'tan(x) + C', d: '-cos(x) + C', ans: 'B' },
  { q: 'Giá trị của giai thừa 5! (năm giai thừa) bằng bao nhiêu?', a: '25', b: '60', c: '120', d: '240', ans: 'C' },
  { q: 'Giá trị của biểu thức logarit thập phân log₁₀(1000) bằng bao nhiêu?', a: '2', b: '3', c: '10', d: '100', ans: 'B' },
  { q: 'Nhà toán học người Việt Nam nào đã xuất sắc giành Huy chương Fields cao quý vào năm 2010?', a: 'Hoàng Tụy', b: 'Ngô Bảo Châu', c: 'Lê Văn Thiêm', d: 'Phan Đình Diệu', ans: 'B' },
  { q: 'Phương trình bậc hai ax² + bx + c = 0 (với a khác 0) có hai nghiệm thực phân biệt khi biệt thức Delta (Δ = b² - 4ac) thỏa mãn điều kiện nào?', a: 'Δ < 0', b: 'Δ = 0', c: 'Δ > 0', d: 'Δ ≤ 0', ans: 'C' },
  { q: 'Trong hình học không gian, khối lập phương có tất cả bao nhiêu mặt đều là hình vuông?', a: '4 mặt', b: '6 mặt', c: '8 mặt', d: '12 mặt', ans: 'B' },
  { q: 'Trong dãy số Fibonacci kinh điển (1, 1, 2, 3, 5, 8, 13, ...), số hạng tiếp theo ngay sau số 13 là số nào?', a: '18', b: '20', c: '21', d: '26', ans: 'C' },
  { q: 'Với mọi góc lượng giác α bất kỳ, giá trị của biểu thức sin²(α) + cos²(α) luôn bằng bao nhiêu?', a: '0', b: '1', c: '2', d: '-1', ans: 'B' },
  { q: 'Số tự nhiên nào nhỏ nhất có 3 chữ số khác nhau?', a: '100', b: '101', c: '102', d: '123', ans: 'C' },
  { q: 'Công thức tính diện tích của một hình tròn có bán kính R là gì?', a: '2πR', b: 'πR²', c: 'πR/2', d: '4πR²', ans: 'B' },
  { q: 'Giá trị của 2 lũy thừa 10 (2¹⁰) bằng bao nhiêu?', a: '512', b: '1000', c: '1024', d: '2048', ans: 'C' },
  { q: 'Một hình đa giác đều có 6 cạnh bằng nhau và 6 góc bằng nhau được gọi là hình gì?', a: 'Ngũ giác đều', b: 'Lục giác đều', c: 'Bát giác đều', d: 'Tứ giác đều', ans: 'B' },
  { q: 'Cơ số của logarit tự nhiên (ký hiệu là ln) là hằng số toán học nào?', a: 'Số π (Pi)', b: 'Số e (Euler)', c: 'Số φ (Tỷ lệ vàng)', d: 'Số 10', ans: 'B' },
  { q: 'Trong thống kê và xác suất, khi tung một đồng xu đồng chất và cân đối một lần, xác suất xuất hiện mặt ngửa là bao nhiêu?', a: '0.25', b: '0.5', c: '0.75', d: '1.0', ans: 'B' },
  { q: 'Khoa Tử Vi Đẩu Số truyền thống sử dụng lá số gồm tất cả bao nhiêu cung chính trên địa bàn?', a: '8 cung', b: '10 cung', c: '12 cung', d: '14 cung', ans: 'C' },
  { q: 'Trong hệ thống 12 Địa Chi của Tử Vi và lịch pháp Á Đông, Địa Chi đứng đầu tiên là chi nào?', a: 'Sửu', b: 'Dần', c: 'Tý', d: 'Mão', ans: 'C' },
  { q: 'Trong hệ thống 10 Thiên Can, Thiên Can đứng đầu tiên là can nào?', a: 'Ất', b: 'Giáp', c: 'Bính', d: 'Đinh', ans: 'B' },
  { q: 'Trong Tử Vi Đẩu Số, chòm sao đứng đầu thống lĩnh các chính tinh (được mệnh danh là Đế Tinh) là sao nào?', a: 'Thiên Phủ', b: 'Tử Vi', c: 'Thái Dương', d: 'Vũ Khúc', ans: 'B' },
  { q: 'Lá số Tử Vi Đẩu Số chuẩn có tổng cộng bao nhiêu Chính Tinh được an vào 12 cung?', a: '10 Chính Tinh', b: '12 Chính Tinh', c: '14 Chính Tinh', d: '18 Chính Tinh', ans: 'C' },
  { q: 'Trong lá số Tử Vi, cung dùng để xem xét về người phối ngẫu (vợ hoặc chồng) và đời sống hôn nhân được gọi là cung gì?', a: 'Cung Phúc Đức', b: 'Cung Phu Thê', c: 'Cung Tử Tức', d: 'Cung Điền Trạch', ans: 'B' },
  { q: 'Trong lá số Tử Vi, cung phản ánh về nhà cửa, đất đai, bất động sản và môi trường sinh sống được gọi là cung gì?', a: 'Cung Tài Bạch', b: 'Cung Quan Lộc', c: 'Cung Điền Trạch', d: 'Cung Thiên Di', ans: 'C' },
  { q: 'Tam hợp bao gồm 3 chính tinh Sát - Phá - Tham trong Tử Vi là viết tắt của bộ 3 sao nào?', a: 'Thất Sát - Phá Quân - Tham Lang', b: 'Kình Dương - Phá Quân - Tham Lang', c: 'Thất Sát - Thiên Phủ - Tham Lang', d: 'Vũ Khúc - Phá Quân - Tham Lang', ans: 'A' },
  { q: 'Trong quy luật Ngũ Hành Tương Sinh, hành nào sinh ra hành Thủy?', a: 'Hành Mộc', b: 'Hành Hỏa', c: 'Hành Thổ', d: 'Hành Kim', ans: 'D' },
  { q: 'Trong quy luật Ngũ Hành Tương Khắc, hành Thủy khắc trực tiếp hành nào sau đây?', a: 'Hành Kim', b: 'Hành Mộc', c: 'Hành Hỏa', d: 'Hành Thổ', ans: 'C' },
  { q: 'Trong Tử Vi Đẩu Số, bộ Tứ Hóa bao gồm 4 sao biến hóa nào?', a: 'Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ', b: 'Hóa Lộc, Hóa Tài, Hóa Quan, Hóa Ấn', c: 'Hóa Phúc, Hóa Lộc, Hóa Thọ, Hóa Khang', d: 'Hóa Quyền, Hóa Ấn, Hóa Mã, Hóa Lộc', ans: 'A' },
  { q: 'Trong Tử Vi, hai cát tinh văn chương nổi tiếng chủ về học vấn, thi cử và khoa bảng là cặp sao nào?', a: 'Tả Phù - Hữu Bật', b: 'Văn Xương - Văn Khúc', c: 'Kình Dương - Đà La', d: 'Địa Không - Địa Kiếp', ans: 'B' },
  { q: 'Trong lá số Tử Vi, cung dùng để xem xét về đường công danh, sự nghiệp và chức vụ được gọi là cung gì?', a: 'Cung Quan Lộc', b: 'Cung Tật Ách', c: 'Cung Phụ Mẫu', d: 'Cung Huynh Đệ', ans: 'A' },
  { q: 'Cặp sao sát tinh Địa Không và Địa Kiếp trong Tử Vi Đẩu Số thường được gọi tắt là bộ sao gì?', a: 'Kình Đà', b: 'Hỏa Linh', c: 'Không Kiếp', d: 'Hình Riêu', ans: 'C' },
  { q: 'Trong vòng Trường Sinh của Tử Vi Đẩu Số có tất cả bao nhiêu sao tương ứng với 12 giai đoạn sinh trưởng và biến dịch?', a: '8 sao', b: '9 sao', c: '10 sao', d: '12 sao', ans: 'D' },
  { q: 'Trong lá số Tử Vi, cung dùng để luận đoán về tiền bạc, thu nhập và khả năng quản lý tài chính là cung nào?', a: 'Cung Tài Bạch', b: 'Cung Nô Bộc', c: 'Cung Tử Tức', d: 'Cung Phụ Mẫu', ans: 'A' },
  { q: 'Tam hợp Cục trong Tử Vi Đẩu Số gồm 5 cục theo Ngũ Hành (Thủy nhị cục, Mộc tam cục, Kim tứ cục, Thổ ngũ cục, Hỏa lục cục). Số đi kèm tên Cục dùng để xác định yếu tố nào trước tiên?', a: 'Số tuổi kết hôn', b: 'Số tuổi bắt đầu Đại Vận đầu tiên và vị trí an sao Tử Vi', c: 'Số lượng anh chị em', d: 'Số năm làm việc', ans: 'B' },
  { q: 'Trong 12 Địa Chi, nhóm Tam Hợp \'Thân - Tý - Thìn\' thuộc hành cục nào trong Ngũ Hành?', a: 'Hỏa cuộc', b: 'Mộc cuộc', c: 'Thủy cuộc', d: 'Kim cuộc', ans: 'C' },
  { q: 'Trong Tử Vi Đẩu Số, sao Thái Dương tượng trưng cho hình ảnh nào trong tự nhiên?', a: 'Mặt Trăng', b: 'Mặt Trời', c: 'Sao Bắc Đẩu', d: 'Sao Kim', ans: 'B' },
  { q: 'Tên gọi tiền thân của Trường Đại học Phenikaa khi mới thành lập vào năm 2007 là gì?', a: 'Trường Đại học Đông Đô', b: 'Trường Đại học Thành Tây', c: 'Trường Đại học Hòa Bình', d: 'Trường Đại học Đại Nam', ans: 'B' },
  { q: 'Đại học Phenikaa có trụ sở chính đặt tại phường Dương Nội, thuộc khu vực quận (cũ) nào của Thủ đô Hà Nội?', a: 'Quận Cầu Giấy', b: 'Quận Đống Đa', c: 'Quận Hà Đông', d: 'Quận Hai Bà Trưng', ans: 'C' },
  { q: 'Mã tuyển sinh đại học chính quy của Đại học Phenikaa là mã nào sau đây?', a: 'DTA', b: 'PKA', c: 'PHK', d: 'TTD', ans: 'B' },
  { q: 'Trường Đại học Thành Tây chính thức được đổi tên thành Trường Đại học Phenikaa theo Quyết định số 1609/QĐ-TTg vào ngày tháng năm nào?', a: '10/10/2017', b: '21/11/2018', c: '15/04/2020', d: '20/11/2019', ans: 'B' },
  { q: 'Ngày 15/4/2025, Thủ tướng Chính phủ đã ban hành Quyết định số 775/QĐ-TTg chuyển đổi mô hình của Trường Đại học Phenikaa thành mô hình nào?', a: 'Học viện Phenikaa', b: 'Đại học Phenikaa', c: 'Viện Đại học Phenikaa', d: 'Khu Đại học Phenikaa', ans: 'B' },
  { q: 'Tập đoàn công nghệ và công nghiệp nào là nhà đầu tư chiến lược phát triển hệ sinh thái Đại học Phenikaa từ năm 2017?', a: 'Tập đoàn Phượng Hoàng Xanh A&A (Phenikaa Group)', b: 'Tập đoàn Vingroup', c: 'Tập đoàn FPT', d: 'Tập đoàn Viettel', ans: 'A' },
  { q: 'Giá trị cốt lõi trong triết lý giáo dục của Đại học Phenikaa được gói gọn trong 3 từ khóa nào?', a: 'Tôn trọng - Sáng tạo - Phản biện', b: 'Nhân văn - Đổi mới - Hội nhập', c: 'Tri thức - Đạo đức - Sáng tạo', d: 'Tiên phong - Bản lĩnh - Trách nhiệm', ans: 'A' },
  { q: 'Tiền thân của Đại học Phenikaa được thành lập ngày 10/10/2007 theo Quyết định số 1368/QĐ-TTg. Vì vậy ngày truyền thống kỷ niệm thành lập trường hàng năm là ngày nào?', a: '20/11', b: '10/10', c: '21/11', d: '26/03', ans: 'B' },
  { q: 'Chủ tịch Hội đồng Tập đoàn Phenikaa kiêm người đặt nền móng tái cấu trúc toàn diện Đại học Phenikaa là vị Tiến sĩ nào?', a: 'TS. Hồ Xuân Năng', b: 'GS.TS. Phạm Thành Huy', c: 'PGS.TS. Nguyễn Phú Khánh', d: 'TS. Đinh Ngọc Hiện', ans: 'A' },
  { q: 'Con đường nơi đặt cổng chính khuôn viên Đại học Phenikaa tại phường Dương Nội, Hà Nội mang tên danh nhân nào?', a: 'Đường Nguyễn Trãi', b: 'Đường Nguyễn Trác', c: 'Đường Tố Hữu', d: 'Đường Lê Trọng Tấn', ans: 'B' },
  { q: 'Trong giai đoạn 2020–2023, Đại học Phenikaa đã nhiều năm liên tiếp dẫn đầu các trường đại học và viện nghiên cứu tại Việt Nam trên bảng xếp hạng công bố khoa học quốc tế uy tín nào?', a: 'Bảng xếp hạng Nature Index', b: 'Bảng xếp hạng Shanghai ARWU', c: 'Bảng xếp hạng Webometrics', d: 'Bảng xếp hạng US News', ans: 'A' },
  { q: 'Năm 2024, Đại học Phenikaa đạt mức xếp hạng bao nhiêu sao theo Hệ thống đối sánh chất lượng giáo dục đại học UPM (University Performance Metrics)?', a: '3 Sao', b: '4 Sao', c: '5 Sao', d: '6 Sao', ans: 'C' },
  { q: 'Viện Nghiên cứu Tiên tiến Phenikaa (nơi quy tụ nhiều nhà khoa học cơ bản hàng đầu của Đại học Phenikaa) có tên viết tắt tiếng Anh là gì?', a: 'PRATI', b: 'PIAS', c: 'PUNI', d: 'PTECH', ans: 'B' },
  { q: 'Khi chuyển đổi sang mô hình Đại học đa ngành vào giai đoạn 2024–2025, Đại học Phenikaa đã thành lập 5 trường thành viên đầu tiên gồm Kỹ thuật, CNTT, Kinh tế, Y - Dược và trường nào?', a: 'Trường Ngoại ngữ - Khoa học xã hội', b: 'Trường Kiến trúc - Xây dựng', c: 'Trường Nông - Lâm - Ngư nghiệp', d: 'Trường Nghệ thuật biểu diễn', ans: 'A' },
  { q: 'Khối ngành Khoa học Sức khỏe của Đại học Phenikaa (Trường Y - Dược Phenikaa) đào tạo các ngành tiêu biểu nào sau đây?', a: 'Y khoa, Dược học, Điều dưỡng, Răng - Hàm - Mặt, Y học cổ truyền', b: 'Chỉ đào tạo Dược học và Điều dưỡng', c: 'Chỉ đào tạo Thú y và Công nghệ sinh học', d: 'Chỉ đào tạo Y tế công cộng', ans: 'A' },
  { q: 'Năm 2024, để đón đầu xu thế công nghệ cao của Việt Nam, Đại học Phenikaa đã thành lập trung tâm đào tạo chuyên sâu trong lĩnh vực chiến lược nào?', a: 'Trung tâm Đào tạo Thiết kế Vi mạch Bán dẫn', b: 'Trung tâm Công nghệ Vũ trụ', c: 'Trung tâm Khai khoáng Biển sâu', d: 'Trung tâm Năng lượng Hạt nhân', ans: 'A' },
  { q: 'Mô hình hệ sinh thái 3 Nhà gắn kết chặt chẽ tại Phenikaa bao gồm 3 trụ cột nào?', a: 'Nhà nước - Nhà nông - Nhà doanh nghiệp', b: 'Nhà trường (Giáo dục) - Nhà khoa học (Nghiên cứu) - Doanh nghiệp (Sản xuất kinh doanh)', c: 'Nhà đầu tư - Nhà phân phối - Nhà tiêu dùng', d: 'Nhà trường - Gia đình - Xã hội', ans: 'B' },
  { q: 'Trang thông tin điện tử (website) chính thức của Đại học Phenikaa có tên miền là gì?', a: 'phenikaa-uni.edu.vn', b: 'phenikaa.com.vn', c: 'thanhtay.edu.vn', d: 'pka.gov.vn', ans: 'A' },
  { q: 'Bệnh viện thực hành quy mô lớn nằm trong hệ sinh thái y tế và đào tạo khối ngành sức khỏe của Phenikaa có tên gọi phổ biến là gì?', a: 'Bệnh viện Đại học Phenikaa (PhenikaaMec)', b: 'Bệnh viện Bạch Mai cơ sở 2', c: 'Bệnh viện Đa khoa Hà Đông', d: 'Bệnh viện Quân y 103', ans: 'A' },
  { q: 'Đỉnh núi Fansipan - \'Nóc nhà Đông Dương\' với độ cao 3.147,3m nằm trên dãy núi nào của Việt Nam?', a: 'Dãy Trường Sơn', b: 'Dãy Hoàng Liên Sơn', c: 'Dãy Ngân Sơn', d: 'Dãy Bắc Sơn', ans: 'B' },
  { q: 'Tỉnh nào có diện tích tự nhiên lớn nhất Việt Nam (trước các đợt sáp nhập hành chính)?', a: 'Thanh Hóa', b: 'Nghệ An', c: 'Gia Lai', d: 'Sơn La', ans: 'B' },
  { q: 'Điểm cực Bắc trên đất liền của Tổ quốc Việt Nam nằm tại xã Lũng Cú thuộc tỉnh nào?', a: 'Cao Bằng', b: 'Lào Cai', c: 'Hà Giang', d: 'Lai Châu', ans: 'C' },
  { q: 'Quần đảo Trường Sa trực thuộc sự quản lý hành chính của tỉnh/thành phố nào của Việt Nam?', a: 'Thành phố Đà Nẵng', b: 'Tỉnh Khánh Hòa', c: 'Tỉnh Bình Thuận', d: 'Tỉnh Bà Rịa - Vũng Tàu', ans: 'B' },
  { q: 'Quần đảo Hoàng Sa trực thuộc sự quản lý hành chính của tỉnh/thành phố nào của Việt Nam?', a: 'Tỉnh Quảng Ngãi', b: 'Tỉnh Quảng Nam', c: 'Thành phố Đà Nẵng', d: 'Tỉnh Thừa Thiên Huế', ans: 'C' },
  { q: 'Con sông nào dài nhất thế giới chảy qua khu vực Đông Bắc châu Phi và đổ ra Địa Trung Hải?', a: 'Sông Amazon', b: 'Sông Nile', c: 'Sông Trường Giang', d: 'Sông Mississippi', ans: 'B' },
  { q: 'Đại dương nào có diện tích lớn nhất và độ sâu trung bình lớn nhất trên Trái Đất?', a: 'Đại Tây Dương', b: 'Ấn Độ Dương', c: 'Thái Bình Dương', d: 'Bắc Băng Dương', ans: 'C' },
  { q: 'Đường bờ biển của đất nước Việt Nam kéo dài từ Móng Cái (Quảng Ninh) đến Hà Tiên (Kiên Giang) dài khoảng bao nhiêu km?', a: '1.960 km', b: '2.540 km', c: '3.260 km', d: '4.120 km', ans: 'C' },
  { q: 'Hang động tự nhiên lớn nhất thế giới Sơn Đoòng nằm trong Vườn quốc gia Phong Nha - Kẻ Bàng thuộc tỉnh nào?', a: 'Hà Tĩnh', b: 'Quảng Bình', c: 'Quảng Trị', d: 'Nghệ An', ans: 'B' },
  { q: 'Hòn đảo có diện tích lớn nhất Việt Nam là đảo nào?', a: 'Đảo Cát Bà', b: 'Đảo Phú Quốc', c: 'Đảo Côn Sơn', d: 'Đảo Lý Sơn', ans: 'B' },
  { q: 'Biên giới trên đất liền của Việt Nam tiếp giáp với 3 quốc gia láng giềng nào?', a: 'Trung Quốc, Lào, Thái Lan', b: 'Trung Quốc, Lào, Campuchia', c: 'Lào, Campuchia, Myanmar', d: 'Trung Quốc, Thái Lan, Campuchia', ans: 'B' },
  { q: 'Hệ thống sông Cửu Long khi chảy vào lãnh thổ Việt Nam chia thành hai nhánh chính là sông nào?', a: 'Sông Hồng và Sông Đà', b: 'Sông Tiền và Sông Hậu', c: 'Sông Đồng Nai và Sông Sài Gòn', d: 'Sông Vàm Cỏ Đông và Vàm Cỏ Tây', ans: 'B' },
  { q: 'Vịnh Hạ Long - Di sản thiên nhiên thế giới được UNESCO công nhận nhiều lần - thuộc tỉnh nào của Việt Nam?', a: 'Hải Phòng', b: 'Quảng Ninh', c: 'Ninh Bình', d: 'Thanh Hóa', ans: 'B' },
  { q: 'Châu lục nào có diện tích tự nhiên lớn nhất trên thế giới?', a: 'Châu Phi', b: 'Châu Mỹ', c: 'Châu Á', d: 'Châu Âu', ans: 'C' },
  { q: 'Quốc gia nào có diện tích lãnh thổ lớn nhất thế giới?', a: 'Canada', b: 'Trung Quốc', c: 'Hoa Kỳ', d: 'Liên bang Nga', ans: 'D' },
  { q: 'Cao nguyên đá Đồng Văn - Công viên địa chất toàn cầu UNESCO đầu tiên của Việt Nam - nằm ở tỉnh nào?', a: 'Cao Bằng', b: 'Hà Giang', c: 'Lạng Sơn', d: 'Bắc Kạn', ans: 'B' },
  { q: 'Hồ nước ngọt tự nhiên trên núi lớn nhất Việt Nam nằm ở tỉnh Bắc Kạn có tên là gì?', a: 'Hồ Tây', b: 'Hồ Ba Bể', c: 'Hồ Thác Bà', d: 'Hồ Tơ Nưng', ans: 'B' },
  { q: 'Đèo Hải Vân nằm trên ranh giới tự nhiên giữa hai tỉnh/thành phố nào của miền Trung Việt Nam?', a: 'Quảng Bình và Quảng Trị', b: 'Huế và Đà Nẵng', c: 'Đà Nẵng và Quảng Nam', d: 'Phú Yên và Khánh Hòa', ans: 'B' },
  { q: 'Thủ đô của đất nước Nhật Bản là thành phố nào?', a: 'Osaka', b: 'Kyoto', c: 'Tokyo', d: 'Yokohama', ans: 'C' },
  { q: 'Năm 938, vị anh hùng dân tộc nào đã lãnh đạo nhân dân ta đánh tan quân Nam Hán trên sông Bạch Đằng, chấm dứt hơn 1000 năm Bắc thuộc?', a: 'Đinh Bộ Lĩnh', b: 'Ngô Quyền', c: 'Lê Hoàn', d: 'Lý Thường Kiệt', ans: 'B' },
  { q: 'Năm 1010, vua Lý Thái Tổ đã ban Chiếu dời đô từ Hoa Lư (Ninh Bình) về Đại La và đổi tên kinh đô mới là gì?', a: 'Đông Đô', b: 'Phú Xuân', c: 'Thăng Long', d: 'Tây Đô', ans: 'C' },
  { q: 'Quốc hiệu đầu tiên của nhà nước sơ khai thời các Vua Hùng trong lịch sử Việt Nam là gì?', a: 'Âu Lạc', b: 'Văn Lang', c: 'Vạn Xuân', d: 'Đại Cồ Việt', ans: 'B' },
  { q: 'Năm 968, sau khi dẹp loạn 12 sứ quân, Đinh Bộ Lĩnh lên ngôi Hoàng đế và đặt quốc hiệu nước ta là gì?', a: 'Đại Việt', b: 'Đại Cồ Việt', c: 'Đại Nam', d: 'Vạn Xuân', ans: 'B' },
  { q: 'Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập khai sinh ra nước Việt Nam Dân chủ Cộng hòa tại Quảng trường Ba Đình vào ngày tháng năm nào?', a: '19/08/1945', b: '02/09/1945', c: '07/05/1954', d: '30/04/1975', ans: 'B' },
  { q: 'Chiến dịch Điện Biên Phủ \'lừng lẫy năm châu, chấn động địa cầu\' kết thúc thắng lợi hoàn toàn vào ngày tháng năm nào?', a: '13/03/1954', b: '30/04/1954', c: '07/05/1954', d: '20/07/1954', ans: 'C' },
  { q: 'Trong cuộc kháng chiến chống quân xâm lược Nguyên - Mông thế kỷ XIII, quân dân nhà Trần đã mấy lần giành thắng lợi vẻ vang?', a: '2 lần', b: '3 lần', c: '4 lần', d: '5 lần', ans: 'B' },
  { q: 'Hội nghị Diên Hồng năm 1285 thời nhà Trần là hội nghị triệu tập những ai về kinh thành Thăng Long để hỏi ý kiến đánh giặc hay hòa?', a: 'Các tướng lĩnh quân đội', b: 'Các bô lão đại diện nhân dân cả nước', c: 'Các quan lại triều đình', d: 'Các nho sĩ đỗ đạt', ans: 'B' },
  { q: 'Vị hoàng đế anh minh nào đã lãnh đạo cuộc khởi nghĩa Lam Sơn đánh đuổi quân Minh và lập nên triều đại Hậu Lê vào năm 1428?', a: 'Lê Thánh Tông', b: 'Lê Lợi (Lê Thái Tổ)', c: 'Nguyễn Trãi', d: 'Quang Trung', ans: 'B' },
  { q: 'Tác phẩm \'Bình Ngô đại cáo\' - bản tuyên ngôn độc lập thứ hai của dân tộc Việt Nam - do danh nhân nào soạn thảo thay lời Lê Lợi?', a: 'Lý Thường Kiệt', b: 'Trần Quốc Tuấn', c: 'Nguyễn Trãi', d: 'Nguyễn Bỉnh Khiêm', ans: 'C' },
  { q: 'Mùa xuân năm Kỷ Dậu (1789), Hoàng đế Quang Trung (Nguyễn Huệ) đã lãnh đạo nghĩa quân Tây Sơn đại phá 29 vạn quân xâm lược nào?', a: 'Quân Tống', b: 'Quân Minh', c: 'Quân Thanh', d: 'Quân Xiêm', ans: 'C' },
  { q: 'Trường đại học đầu tiên của Việt Nam được xây dựng vào năm 1076 dưới triều đại nhà Lý có tên là gì?', a: 'Quốc Tử Giám', b: 'Sùng Chính Viện', c: 'Quốc Sử Quán', d: 'Hàn Lâm Viện', ans: 'A' },
  { q: 'Bộ luật thành văn đầu tiên trong lịch sử phong kiến Việt Nam được ban hành năm 1042 dưới thời vua Lý Thái Tông có tên là gì?', a: 'Luật Hồng Đức', b: 'Hình thư', c: 'Hoàng Việt luật lệ', d: 'Quốc triều hình luật', ans: 'B' },
  { q: 'Đảng Cộng sản Việt Nam được thành lập vào ngày 03/02/1930 tại hội nghị hợp nhất các tổ chức cộng sản do Nguyễn Ái Quốc chủ trì ở đâu?', a: 'Quảng Châu (Trung Quốc)', b: 'Hương Cảng (Hồng Kông, Trung Quốc)', c: 'Pác Bó (Cao Bằng)', d: 'Tân Trào (Tuyên Quang)', ans: 'B' },
  { q: 'Sau gần 30 năm bôn ba tìm đường cứu nước, lãnh tụ Nguyễn Ái Quốc đã trở về Tổ quốc vào ngày 28/01/1941 tại Pác Bó thuộc tỉnh nào?', a: 'Lạng Sơn', b: 'Cao Bằng', c: 'Tuyên Quang', d: 'Thái Nguyên', ans: 'B' },
  { q: 'Chiến dịch lịch sử giải phóng hoàn toàn miền Nam, thống nhất đất nước vào ngày 30/04/1975 mang tên là gì?', a: 'Chiến dịch Tây Nguyên', b: 'Chiến dịch Huế - Đà Nẵng', c: 'Chiến dịch Hồ Chí Minh', d: 'Chiến dịch Đường 9 - Nam Lào', ans: 'C' },
  { q: 'Hai Bà Trưng phất cờ khởi nghĩa chống ách đô hộ của nhà Đông Hán vào năm 40 sau Công nguyên tại cửa sông nào?', a: 'Sông Bạch Đằng', b: 'Sông Hát (Hát Môn)', c: 'Sông Như Nguyệt', d: 'Sông Gianh', ans: 'B' },
  { q: 'Vị vua cuối cùng của triều đại phong kiến nhà Nguyễn trong lịch sử Việt Nam là ai?', a: 'Vua Hàm Nghi', b: 'Vua Duy Tân', c: 'Vua Khải Định', d: 'Vua Bảo Đại', ans: 'D' },
  { q: 'Hiệp định Paris về chấm dứt chiến tranh, lập lại hòa bình ở Việt Nam được ký kết chính thức vào tháng 1 năm nào?', a: 'Năm 1968', b: 'Năm 1972', c: 'Năm 1973', d: 'Năm 1975', ans: 'C' },
  { q: 'Theo Luật Doanh nghiệp 2020 của Việt Nam, Công ty cổ phần phải có số lượng cổ đông tối thiểu là bao nhiêu?', a: '1 cổ đông', b: '2 cổ đông', c: '3 cổ đông', d: '5 cổ đông', ans: 'C' },
  { q: 'Theo Luật Doanh nghiệp 2020, Công ty trách nhiệm hữu hạn hai thành viên trở lên có số lượng thành viên tối đa là bao nhiêu?', a: '20 thành viên', b: '30 thành viên', c: '50 thành viên', d: '100 thành viên', ans: 'C' },
  { q: 'Theo Luật Doanh nghiệp 2020, loại hình doanh nghiệp nào sau đây KHÔNG có tư cách pháp nhân?', a: 'Công ty cổ phần', b: 'Công ty TNHH một thành viên', c: 'Doanh nghiệp tư nhân', d: 'Công ty hợp danh', ans: 'C' },
  { q: 'Trong Công ty hợp danh theo quy định của pháp luật Việt Nam, thành viên hợp danh phải là đối tượng nào và chịu trách nhiệm như thế nào?', a: 'Tổ chức, chịu trách nhiệm hữu hạn', b: 'Cá nhân, chịu trách nhiệm bằng toàn bộ tài sản của mình về các nghĩa vụ của công ty', c: 'Cá nhân, chỉ chịu trách nhiệm trong phạm vi vốn góp', d: 'Bất kỳ cá nhân hoặc tổ chức nào', ans: 'B' },
  { q: 'Theo Luật Doanh nghiệp 2020, thời hạn để các thành viên/cổ đông sáng lập thanh toán đủ số vốn đã đăng ký góp khi thành lập doanh nghiệp là bao nhiêu ngày kể từ ngày được cấp Giấy chứng nhận đăng ký doanh nghiệp?', a: '30 ngày', b: '60 ngày', c: '90 ngày', d: '120 ngày', ans: 'C' },
  { q: 'Cơ quan có quyền quyết định cao nhất trong Công ty cổ phần theo Luật Doanh nghiệp Việt Nam là cơ quan nào?', a: 'Hội đồng quản trị', b: 'Đại hội đồng cổ đông', c: 'Ban kiểm soát', d: 'Tổng giám đốc', ans: 'B' },
  { q: 'Theo Luật Thuế giá trị gia tăng (GTGT) hiện hành tại Việt Nam, mức thuế suất phổ thông chuẩn áp dụng cho đa số hàng hóa, dịch vụ (khi không thuộc diện giảm thuế tạm thời) là bao nhiêu phần trăm?', a: '5%', b: '10%', c: '15%', d: '20%', ans: 'B' },
  { q: 'Theo Luật Thuế thu nhập doanh nghiệp của Việt Nam, mức thuế suất phổ thông áp dụng cho các doanh nghiệp thông thường là bao nhiêu phần trăm?', a: '10%', b: '15%', c: '20%', d: '25%', ans: 'C' },
  { q: 'Theo Luật Thương mại 2005 của Việt Nam, mức phạt vi phạm hợp đồng thương mại do các bên thỏa thuận không được vượt quá bao nhiêu phần trăm giá trị phần nghĩa vụ hợp đồng bị vi phạm (trừ trường hợp giám định)?', a: '5%', b: '8%', c: '12%', d: '20%', ans: 'B' },
  { q: 'Theo Luật Phá sản 2014 của Việt Nam, doanh nghiệp mất khả năng thanh toán là doanh nghiệp không thực hiện nghĩa vụ thanh toán khoản nợ trong thời hạn bao lâu kể từ ngày đến hạn thanh toán?', a: '01 tháng', b: '03 tháng', c: '06 tháng', d: '12 tháng', ans: 'B' },
  { q: 'Trong giải quyết tranh chấp kinh doanh thương mại, phán quyết của Trọng tài thương mại có đặc điểm pháp lý nào sau đây?', a: 'Có thể kháng cáo lên Trọng tài cấp cao', b: 'Có giá trị chung thẩm và có hiệu lực kể từ ngày ban hành', c: 'Chỉ mang tính chất tham khảo', d: 'Phải được Tòa án xét xử lại từ đầu', ans: 'B' },
  { q: 'Theo Bộ luật Dân sự 2015, giao dịch dân sự do người không có năng lực hành vi dân sự xác lập sẽ dẫn đến hậu quả pháp lý gì (trừ giao dịch phục vụ nhu cầu sinh hoạt hàng ngày)?', a: 'Vẫn có hiệu lực bình thường', b: 'Giao dịch dân sự vô hiệu', c: 'Chỉ bị phạt hành chính', d: 'Tự động chuyển sang hợp đồng lao động', ans: 'B' },
  { q: 'Theo Bộ luật Lao động 2019 của Việt Nam, thời gian thử việc tối đa đối với công việc cần trình độ chuyên môn, kỹ thuật từ cao đẳng trở lên (không phải người quản lý doanh nghiệp) là bao nhiêu ngày?', a: '06 ngày làm việc', b: '30 ngày', c: '60 ngày', d: '180 ngày', ans: 'C' },
  { q: 'Theo Luật Doanh nghiệp 2020, mỗi cá nhân chỉ được quyền thành lập tối đa bao nhiêu Doanh nghiệp tư nhân?', a: '01 doanh nghiệp tư nhân', b: '02 doanh nghiệp tư nhân', c: '03 doanh nghiệp tư nhân', d: 'Không giới hạn số lượng', ans: 'A' },
  { q: 'Cổ phần nào trong Công ty cổ phần là loại cổ phần bắt buộc phải có và không thể chuyển đổi thành cổ phần ưu đãi?', a: 'Cổ phần ưu đãi biểu quyết', b: 'Cổ phần ưu đãi cổ tức', c: 'Cổ phần phổ thông', d: 'Cổ phần ưu đãi hoàn lại', ans: 'C' },
  { q: 'Theo Luật Đầu tư của Việt Nam, hoạt động kinh doanh pháo nổ thuộc danh mục ngành nghề nào?', a: 'Ngành nghề đầu tư kinh doanh có điều kiện', b: 'Ngành nghề cấm đầu tư kinh doanh', c: 'Ngành nghề ưu đãi đầu tư', d: 'Ngành nghề tự do kinh doanh', ans: 'B' },
  { q: 'Theo Luật Sở hữu trí tuệ Việt Nam, Giấy chứng nhận đăng ký nhãn hiệu có hiệu lực trong vòng bao nhiêu năm kể từ ngày nộp đơn (và có thể gia hạn nhiều lần)?', a: '5 năm', b: '10 năm', c: '15 năm', d: '20 năm', ans: 'B' },
  { q: 'Trong hợp đồng mua bán hàng hóa, khoản tiền mà một bên giao cho bên kia trong một thời hạn để bảo đảm giao kết hoặc thực hiện hợp đồng được gọi là gì?', a: 'Cầm cố', b: 'Thế chấp', c: 'Đặt cọc', d: 'Bảo lãnh', ans: 'C' },
  { q: 'Danh y lỗi lạc Hải Thượng Lãn Ông - Đại danh y của nền Y học cổ truyền Việt Nam thế kỷ XVIII - có tên thật là gì?', a: 'Nguyễn Bá Tĩnh', b: 'Lê Hữu Trác', c: 'Chu Văn An', d: 'Nguyễn Bỉnh Khiêm', ans: 'B' },
  { q: 'Danh y Tuệ Tĩnh với câu nói bất hủ \'Nam dược trị Nam nhân\' (Thuốc Nam chữa người Nam) có tên thật là gì?', a: 'Lê Hữu Trác', b: 'Nguyễn Bá Tĩnh', c: 'Lý Đạo Tái', d: 'Trần Nguyên Đán', ans: 'B' },
  { q: 'Bộ sách y học đồ sộ bậc nhất lịch sử Y học cổ truyền Việt Nam gồm 28 tập, 66 quyển do Hải Thượng Lãn Ông biên soạn có tên là gì?', a: 'Nam dược thần hiệu', b: 'Hải Thượng y tông tâm lĩnh', c: 'Bản thảo cương mục', d: 'Hoàng Đế nội kinh', ans: 'B' },
  { q: 'Trong phương pháp chẩn đoán của Y học cổ truyền, \'Tứ chẩn\' bao gồm 4 kỹ thuật khám bệnh nào?', a: 'Vọng - Văn - Vấn - Thiết', b: 'Hàn - Nhiệt - Hư - Thực', c: 'Âm - Dương - Biểu - Lý', d: 'Khí - Huyết - Tinh - Thần', ans: 'A' },
  { q: 'Trong lý luận \'Bát cương\' của Y học cổ truyền để quy nạp hội chứng bệnh, 8 cương lĩnh cơ bản bao gồm những cặp nào?', a: 'Âm - Dương, Biểu - Lý, Hàn - Nhiệt, Hư - Thực', b: 'Tâm - Can - Tỳ - Phế - Thận - Đởm - Vị - Bàng quang', c: 'Phong - Hàn - Thử - Thấp - Táo - Hỏa - Đàm - Ứ', d: 'Kim - Mộc - Thủy - Hỏa - Thổ - Khí - Huyết - Tân', ans: 'A' },
  { q: 'Theo học thuyết Tạng Tượng và Ngũ Hành trong Y học cổ truyền, \'Ngũ tạng\' bao gồm 5 tạng chính nào?', a: 'Tâm, Can, Tỳ, Phế, Thận', b: 'Đởm, Vị, Tiểu trường, Đại trường, Bàng quang', c: 'Tâm, Phế, Vị, Đởm, Tam tiêu', d: 'Can, Đởm, Tỳ, Vị, Thận', ans: 'A' },
  { q: 'Trong học thuyết Ngũ Hành ứng dụng vào Y học cổ truyền, tạng Can (Gan) thuộc hành nào và khai khiếu ra đâu?', a: 'Hành Hỏa, khai khiếu ra lưỡi', b: 'Hành Mộc, khai khiếu ra mắt', c: 'Hành Thổ, khai khiếu ra miệng', d: 'Hành Thủy, khai khiếu ra tai', ans: 'B' },
  { q: 'Theo Y học cổ truyền, tạng Thận thuộc hành Thủy và chủ về chức năng cốt lõi nào sau đây?', a: 'Chủ huyết mạch và tàng thần', b: 'Chủ tàng tinh, chủ cốt tủy và nạp khí', c: 'Chủ vận hóa đồ ăn thức uống', d: 'Chủ tuyên phát và túc giáng', ans: 'B' },
  { q: 'Trong Y học cổ truyền, vị thuốc \'Cam thảo\' nổi tiếng thường đóng vai trò là vị \'Sứ\' trong các phương thuốc vì có tác dụng đặc trưng nào?', a: 'Phát hãn giải biểu cực mạnh', b: 'Điều hòa các vị thuốc, bổ tỳ ích khí, thanh nhiệt giải độc', c: 'Chỉ dùng để sát trùng ngoài da', d: 'Gây ngủ mạnh', ans: 'B' },
  { q: 'Huyệt \'Hợp Cốc\' - một trong những huyệt vị thông dụng nhất để giảm đau đầu, đau răng và giải cảm - nằm ở vị trí nào trên cơ thể?', a: 'Ở chính giữa đỉnh đầu', b: 'Ở mu bàn tay, giữa xương bàn ngón cái (I) và ngón trỏ (II)', c: 'Ở dưới mắt cá chân trong', d: 'Ở giữa rốn', ans: 'B' },
  { q: 'Huyệt \'Túc Tam Lý\' - huyệt vị nổi tiếng về kiện tỳ vị và nâng cao sức đề kháng - nằm ở vùng nào trên cơ thể?', a: 'Mặt trước cẳng chân, dưới hõm ngoài xương bánh chè 3 thốn', b: 'Giữa hai đầu lông mày', c: 'Phía sau gáy sát hộp sọ', d: 'Ở cổ tay phía ngón út', ans: 'A' },
  { q: 'Huyệt \'Bách Hội\' - nơi hội tụ của các kinh dương trên cơ thể - nằm ở vị trí giải phẫu nào?', a: 'Lòng bàn chân', b: 'Chính giữa đỉnh đầu (giao điểm đường nối hai đỉnh vành tai và đường dọc giữa đầu)', c: 'Giữa ngực ngang hai núm vú', d: 'Dưới rốn 3 thốn', ans: 'B' },
  { q: 'Trong dược học cổ truyền, \'Tứ khí\' (Tứ tính) của các vị thuốc dùng để chỉ 4 tính chất nào?', a: 'Chua, Cay, Mặn, Ngọt', b: 'Hàn (lạnh), Nhiệt (nóng), Ôn (ấm), Lương (mát)', c: 'Thăng, Giáng, Phù, Trầm', d: 'Bổ, Tả, Hòa, Giải', ans: 'B' },
  { q: 'Trong dược học cổ truyền, \'Ngũ vị\' của thuốc bao gồm 5 vị cơ bản nào?', a: 'Tân (cay), Cam (ngọt), Toan (chua), Khổ (đắng), Hàm (mặn)', b: 'Cay, Ngọt, Đắng, Chát, Bùi', c: 'Chua, Cay, Nóng, Lạnh, Nhạt', d: 'Mặn, Ngọt, Thơm, Đắng, Nồng', ans: 'A' },
  { q: 'Bài thuốc cổ phương nổi tiếng \'Tứ quân tử thang\' (gồm Nhân sâm/Đảng sâm, Bạch truật, Phục linh, Cam thảo) có công dụng chính là gì?', a: 'Bổ huyết điều kinh', b: 'Ích khí kiện tỳ (bổ khí)', c: 'Thanh nhiệt tả hỏa', d: 'Khu phong trừ thấp', ans: 'B' },
  { q: 'Bài thuốc cổ phương \'Tứ vật thang\' (gồm Thục địa, Đương quy, Bạch thược, Xuyên khung) là phương thuốc cơ bản hàng đầu dùng để điều trị chứng gì?', a: 'Bổ huyết và điều huyết (chứng huyết hư, huyết ứ)', b: 'Giải cảm phong hàn', c: 'Tiêu thực đạo trệ', d: 'Lợi thủy thẩm thấp', ans: 'A' },
  { q: 'Theo nguyên lý \'Lục dâm\' (6 thứ tà khí bên ngoài gây bệnh) trong Y học cổ truyền, 6 yếu tố khí hậu đó là gì?', a: 'Phong, Hàn, Thử, Thấp, Táo, Hỏa', b: 'Hỷ, Nộ, Ưu, Tư, Bi, Khủng', c: 'Kim, Mộc, Thủy, Hỏa, Thổ, Khí', d: 'Kinh, Khiếp, Buồn, Vui, Giận, Lo', ans: 'A' },
  { q: 'Phương pháp chữa bệnh dùng sức nóng của ngải cứu (mồi ngải hoặc điếu ngải) tác động lên các huyệt vị trong Y học cổ truyền được gọi là gì?', a: 'Châm (Châm kim)', b: 'Cứu (Cứu ngải)', c: 'Bấm huyệt', d: 'Giác hơi', ans: 'B' },
];


/* ================================================================
   2. CẤU HÌNH THANG TIỀN THƯỞNG
================================================================ */
// index 0 = câu 1, index 14 = câu 15
const PRIZE_MAP = [100, 100, 100, 100, 500, 100, 100, 100, 100, 500, 100, 100, 100, 100, 500];
const MILESTONES = new Set([5, 10, 15]); // câu mốc (1-indexed)
const SAFE_LEVELS = [0, 5, 10];           // mốc an toàn (câu đã VƯỢT QUA được)

/* ================================================================
   3. TRẠNG THÁI GAME
================================================================ */
let uploadedQuestions = [];   // câu hỏi từ file .txt
let gameQuestions     = [];   // 15 câu đang chơi trong ván này
let currentIndex      = 0;    // index trong gameQuestions (0-14)
let isPlaying         = false;
let isAnswering       = false; // khoá nút trong khi chờ kết quả
let sessionPrize      = 0;    // tiền thưởng ván hiện tại (chưa tích luỹ)
let totalFund         = parseInt(localStorage.getItem('altp_totalFund'), 10) || 0; // quỹ tích luỹ (lưu localStorage)
let lifelinesUsed     = { '5050': false, audience: false, phone: false };

/* ================================================================
   4. DOM REFERENCES
================================================================ */
const $ = id => document.getElementById(id);

const elUploadHint    = $('upload-hint');
const elFileUpload    = $('file-upload');
const elBtnStart      = $('btn-start');
const elBtnSample     = $('btn-sample');
const elBtnMusic      = $('btn-music');
const elBtnClaim      = $('btn-claim');
const elBtnStop       = $('btn-stop');
const elPrizeFund     = $('prize-fund');
const elQuestionNum   = $('question-number');
const elCurrentPrize  = $('current-prize');
const elQuestionText  = $('question-text');
const elLadderList    = $('ladder-list');

const elAnswers = {
  A: $('ans-A'), B: $('ans-B'), C: $('ans-C'), D: $('ans-D'),
};
const elAnswerTexts = {
  A: $('ans-A-text'), B: $('ans-B-text'), C: $('ans-C-text'), D: $('ans-D-text'),
};

const elModalLL      = $('modal-lifeline');
const elModalLLTitle = $('modal-ll-title');
const elModalLLBody  = $('modal-ll-body');
const elModalLLClose = $('modal-ll-close');
const elModalRW      = $('modal-reward');
const elModalRWTitle = $('modal-rw-title');
const elModalRWBody  = $('modal-rw-body');
const elModalRWClose = $('modal-rw-close');
const elModalRWClaim = $('modal-rw-claim');  // nút "Nhận thưởng" trong modal kết thúc ván
const elModalZalo      = $('modal-zalo');
const elModalZaloBody  = $('modal-zalo-body');
const elModalZaloClose = $('modal-zalo-close');

const elLL5050    = $('ll-5050');
const elLLAud     = $('ll-audience');
const elLLPhone   = $('ll-phone');

/* ================================================================
   5. KHỞI TẠO THANG TIỀN (render lại từ PRIZE_MAP)
================================================================ */
function renderLadder() {
  elLadderList.innerHTML = '';
  for (let q = 15; q >= 1; q--) {
    const li = document.createElement('li');
    li.className = 'ladder-item' + (MILESTONES.has(q) ? ' milestone' : '');
    li.dataset.q = q;
    const prize = PRIZE_MAP[q - 1];
    li.innerHTML = `Câu ${q} — <strong>${prize} VNĐ</strong>`;
    elLadderList.appendChild(li);
  }
}

function updateLadderHighlight() {
  const currentQ = currentIndex + 1; // 1-indexed
  document.querySelectorAll('.ladder-item').forEach(li => {
    const q = parseInt(li.dataset.q, 10);
    li.classList.remove('active', 'passed');
    if (q === currentQ)       li.classList.add('active');
    else if (q < currentQ)    li.classList.add('passed');
  });
}

/* ================================================================
   6. PARSE FILE .TXT
================================================================ */
function parseLines(text) {
  const lines = text.split('\n');
  const result = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue; // bỏ dòng trống / comment
    const parts = line.split('|').map(s => s.trim());
    if (parts.length !== 6) continue; // bỏ dòng sai định dạng
    const [q, a, b, c, d, ans] = parts;
    const key = ans.toUpperCase();
    if (!['A', 'B', 'C', 'D'].includes(key)) continue;
    result.push({ q, a, b, c, d, ans: key });
  }
  return result;
}

/* ================================================================
   7. XÁO TRỘN & CHỌN 15 CÂU
================================================================ */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickQuestions(pool) {
  const shuffled = shuffle(pool);
  return shuffled.slice(0, Math.min(15, shuffled.length));
}

/* ================================================================
   8. HIỂN THỊ CÂU HỎI
================================================================ */
function displayQuestion() {
  const q = gameQuestions[currentIndex];
  const qNum = currentIndex + 1;
  const prize = PRIZE_MAP[currentIndex];

  // Cập nhật badge + mức thưởng câu hiện tại
  elQuestionNum.textContent  = `Câu ${qNum}`;
  elCurrentPrize.textContent = `${prize} VNĐ`;

  // Nội dung câu hỏi
  elQuestionText.textContent = q.q;

  // Nội dung 4 đáp án
  elAnswerTexts.A.textContent = q.a;
  elAnswerTexts.B.textContent = q.b;
  elAnswerTexts.C.textContent = q.c;
  elAnswerTexts.D.textContent = q.d;

  // Reset trạng thái nút đáp án
  Object.values(elAnswers).forEach(btn => {
    btn.className = 'answer-btn';
    btn.disabled  = false;
    btn.style.visibility = '';
  });

  isAnswering = false;
  updateLadderHighlight();
}

/* ================================================================
   9. XỬ LÝ CHỌN ĐÁP ÁN
================================================================ */
function handleAnswer(key) {
  if (!isPlaying || isAnswering) return;
  isAnswering = true;

  // Khoá tất cả đáp án trong khi chờ
  Object.values(elAnswers).forEach(btn => btn.disabled = true);

  const correctKey = gameQuestions[currentIndex].ans;
  const chosenBtn  = elAnswers[key];

  // SFX: bíp chọn đáp án
  sfxSelect();

  // Bước 1: đổi màu cam — đang xem xét
  chosenBtn.classList.add('selecting');
  // (CSS class .selecting sẽ được thêm inline nếu chưa có trong style.css)
  chosenBtn.style.background = '#e07b00';
  chosenBtn.style.borderColor = '#ff9900';

  setTimeout(() => {
    // Bước 2: kiểm tra đúng / sai
    chosenBtn.style.background = '';
    chosenBtn.style.borderColor = '';

    if (key === correctKey) {
      // ĐÚNG
      chosenBtn.classList.add('correct');
      sfxCorrect(); // âm báo đúng
      sessionPrize += PRIZE_MAP[currentIndex];
      updateSessionPrizeDisplay();

      if (currentIndex === 14) {
        // Hoàn thành câu 15 — thắng toàn bộ
        setTimeout(() => endGame('win'), 1500);
      } else {
        setTimeout(() => {
          currentIndex++;
          displayQuestion();
        }, 1500);
      }
    } else {
      // SAI
      chosenBtn.classList.add('wrong');
      sfxWrong(); // âm báo sai
      elAnswers[correctKey].classList.add('correct');

      setTimeout(() => endGame('lose'), 1800);
    }
  }, 1000);
}

/* ================================================================
   10. KẾT THÚC GAME
================================================================ */
function safeAmount() {
  // Tìm mốc an toàn cao nhất đã vượt qua
  const passedQ = currentIndex; // số câu đã trả lời ĐÚNG (0-indexed hiện tại)
  let safe = 0;
  if (passedQ >= 10) safe = PRIZE_MAP.slice(0, 10).reduce((s, v) => s + v, 0);
  else if (passedQ >= 5) safe = PRIZE_MAP.slice(0, 5).reduce((s, v) => s + v, 0);
  return safe;
}

function endGame(reason) {
  isPlaying = false;
  setAnswersDisabled(true);
  setLifelinesDisabled(true);

  let earned = 0;
  let title  = '';
  let body   = '';

  if (reason === 'win') {
    earned = sessionPrize; // đã cộng đủ trong handleAnswer
    title  = '🎉 Chúc mừng! Bạn là Triệu Phú!';
    body   = `Bạn đã trả lời đúng tất cả 15 câu và nhận được<br><strong>${earned} VNĐ</strong>!`;
  } else if (reason === 'lose') {
    earned = safeAmount();
    sessionPrize = earned;
    updateSessionPrizeDisplay();
    title  = '😢 Rất tiếc!';
    body   = `Bạn đã trả lời sai. Theo mốc an toàn, bạn nhận được<br><strong>${earned} VNĐ</strong>.`;
  } else if (reason === 'stop') {
    earned = sessionPrize;
    title  = '🛑 Dừng cuộc chơi';
    body   = `Bạn chủ động dừng lại và bảo toàn được<br><strong>${earned} VNĐ</strong>.`;
  }

  totalFund += earned;
  sessionPrize = 0;
  updateFundDisplay();

  showRewardModal(title, body, earned);
}

/* ================================================================
   11. CẬP NHẬT HIỂN THỊ TIỀN
================================================================ */
function updateSessionPrizeDisplay() {
  elCurrentPrize.textContent = `${PRIZE_MAP[currentIndex]} VNĐ`;
  // Tổng đã kiếm trong ván = sessionPrize (hiển thị trong prize-fund tạm thời)
  elPrizeFund.textContent = `${totalFund + sessionPrize} VNĐ`;
}

function updateFundDisplay() {
  elPrizeFund.textContent = `${totalFund} VNĐ`;
  localStorage.setItem('altp_totalFund', totalFund);
}

/* ================================================================
   12. MODAL HELPERS
================================================================ */
function openModal(overlay) { overlay.classList.add('open'); }
function closeModal(overlay) { overlay.classList.remove('open'); }

function showRewardModal(title, body, amount, trophy = '🏆') {
  $('modal-rw-trophy').textContent    = trophy;
  elModalRWTitle.textContent          = title;
  elModalRWBody.innerHTML             = body;
  $('modal-rw-amount').textContent    = `${amount} VNĐ`;
  // Ẩn/hiện nút Nhận thưởng trong modal kết thúc ván
  if (elModalRWClaim) {
    elModalRWClaim.style.display = (totalFund > 0 || amount > 0) ? '' : 'none';
  }
  openModal(elModalRW);
}

function showLifelineModal(title, body) {
  elModalLLTitle.textContent = title;
  elModalLLBody.innerHTML    = body;
  openModal(elModalLL);
}

/* ================================================================
   13. QUYỀN TRỢ GIÚP
================================================================ */
function use5050() {
  if (lifelinesUsed['5050'] || !isPlaying || isAnswering) return;
  lifelinesUsed['5050'] = true;
  elLL5050.disabled = true;

  const correct = gameQuestions[currentIndex].ans;
  const allKeys  = ['A', 'B', 'C', 'D'];
  // Lấy 2 key sai ngẫu nhiên để ẩn
  const wrongs = shuffle(allKeys.filter(k => k !== correct));
  const toHide = wrongs.slice(0, 2);
  toHide.forEach(k => {
    elAnswers[k].style.visibility = 'hidden';
  });
}

function useAudience() {
  if (lifelinesUsed.audience || !isPlaying || isAnswering) return;
  lifelinesUsed.audience = true;
  elLLAud.disabled = true;

  const correct = gameQuestions[currentIndex].ans;
  // Chỉ poll cho các đáp án đang còn hiển thị (tôn trọng 50:50)
  const visibleKeys = ['A', 'B', 'C', 'D'].filter(k =>
    elAnswers[k].style.visibility !== 'hidden'
  );

  // Mô phỏng vote khán giả: đáp án đúng được ~55-70%, còn lại chia đều
  const correctPct = 55 + Math.floor(Math.random() * 16);
  let remaining = 100 - correctPct;
  const others = visibleKeys.filter(k => k !== correct);
  const pcts = {};
  others.forEach((k, i) => {
    if (i < others.length - 1) {
      const p = Math.floor(remaining / (others.length - i));
      pcts[k] = p;
      remaining -= p;
    } else {
      pcts[k] = remaining;
    }
  });
  pcts[correct] = correctPct;

  const bars = visibleKeys.map(k => `
    <div style="display:flex;align-items:center;gap:8px;margin:6px 0">
      <strong style="min-width:18px">${k}</strong>
      <div style="flex:1;background:#1a2a5e;border-radius:4px;overflow:hidden;height:22px">
        <div style="width:${pcts[k]}%;background:#7b4fff;height:100%;border-radius:4px;
                    display:flex;align-items:center;justify-content:center;
                    font-size:0.82rem;font-weight:700;color:#fff">
          ${pcts[k]}%
        </div>
      </div>
    </div>`).join('');

  showLifelineModal('👥 Ý kiến khán giả', bars);
}

function usePhone() {
  if (lifelinesUsed.phone || !isPlaying || isAnswering) return;
  lifelinesUsed.phone = true;
  elLLPhone.disabled = true;

  const correct = gameQuestions[currentIndex].ans;
  const names   = ['Anh Minh', 'Chị Lan', 'Bạn Nam', 'Chú Hùng'];
  const name    = names[Math.floor(Math.random() * names.length)];

  // Xác suất 80% gợi ý đúng
  const hint = Math.random() < 0.8 ? correct : ['A','B','C','D'].filter(k => k !== correct)[Math.floor(Math.random()*3)];

  const msg = `
    <p>📞 <em>${name}</em> nói:</p>
    <blockquote style="border-left:3px solid #f5c518;padding-left:12px;margin:12px 0;color:#ccc">
      "Mình nghĩ đáp án là <strong style="color:#f5c518;font-size:1.3em">${hint}</strong>,
       nhưng mình không chắc 100% đâu nhé!"
    </blockquote>`;

  showLifelineModal('📞 Gọi điện cho người thân', msg);
}

/* ================================================================
   14. HELPERS BẬT/TẮT CONTROLS
================================================================ */
function setAnswersDisabled(val) {
  Object.values(elAnswers).forEach(btn => btn.disabled = val);
}

function setLifelinesDisabled(val) {
  if (!lifelinesUsed['5050'])  elLL5050.disabled  = val;
  if (!lifelinesUsed.audience) elLLAud.disabled   = val;
  if (!lifelinesUsed.phone)    elLLPhone.disabled  = val;
  elBtnStop.disabled = val;
}

/* ================================================================
   15. BẮT ĐẦU GAME
================================================================ */
function startGame() {
  const pool = uploadedQuestions.length >= 15 ? uploadedQuestions : DEFAULT_QUESTIONS;

  if (pool.length < 15) {
    alert(`Cần ít nhất 15 câu hỏi. File hiện tại chỉ có ${pool.length} câu hợp lệ.`);
    return;
  }

  gameQuestions   = pickQuestions(pool);
  currentIndex    = 0;
  sessionPrize    = 0;
  isPlaying       = true;
  lifelinesUsed   = { '5050': false, audience: false, phone: false };

  // Reset lifeline buttons
  elLL5050.disabled  = false;
  elLLAud.disabled   = false;
  elLLPhone.disabled = false;
  elBtnStop.disabled = false;

  renderLadder();
  displayQuestion();
  updateFundDisplay();

  // Tự động phát nhạc nền khi bắt đầu (tuân thủ autoplay policy — cần gesture trước)
  bgmPlay();
}

/* ================================================================
   16. TẠO VÀ TẢI FILE MẪU
================================================================ */
function downloadSample() {
  const lines = DEFAULT_QUESTIONS.map(q =>
    `${q.q} | ${q.a} | ${q.b} | ${q.c} | ${q.d} | ${q.ans}`
  ).join('\n');

  const header = `# File câu hỏi Ai Là Triệu Phú
# Định dạng: Câu hỏi | Đáp án A | Đáp án B | Đáp án C | Đáp án D | Đáp án đúng (A/B/C/D)
# Dòng bắt đầu bằng # là chú thích, sẽ bị bỏ qua.
`;

  const blob = new Blob([header + lines], { type: 'text/plain;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'cau_hoi_mau.txt';
  a.click();
  URL.revokeObjectURL(url);
}

/* ================================================================
   17. NHẬN THƯỞNG — MODAL ZALO
================================================================ */
const ZALO_PHONE = '0971504457';
const ZALO_LINK  = `https://zalo.me/${ZALO_PHONE}`;

/** Mở modal Zalo nhận thưởng */
function openZaloModal() {
  if (totalFund === 0) {
    showRewardModal(
      '💰 Quỹ trống',
      'Chưa có tiền thưởng nào được tích luỹ.<br>Hãy chơi và thắng để tích luỹ nhé!',
      0,
      '💸'
    );
    return;
  }

  elModalZaloBody.innerHTML = `
    <p>Chúc mừng bạn đã tích lũy được
      <strong style="color:#f5c518;font-size:1.4em">${totalFund} VNĐ</strong>!
    </p>
    <p style="margin:12px 0;line-height:1.7">
      Vui lòng chụp màn hình và nhắn tin qua Zalo số
      <strong style="color:#f5c518">${ZALO_PHONE}</strong> để nhận thưởng.
    </p>
    <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:16px">
      <button
        class="btn btn-secondary"
        style="min-width:200px"
        onclick="navigator.clipboard.writeText('${ZALO_PHONE}')
          .then(()=>{ this.textContent='✅ Đã sao chép!'; })
          .catch(()=>{ this.textContent='❌ Lỗi sao chép'; })">
        📋 Sao chép số Zalo (${ZALO_PHONE})
      </button>
      <a
        href="${ZALO_LINK}"
        target="_blank"
        rel="noopener"
        class="btn btn-primary"
        style="text-decoration:none;min-width:200px;display:inline-flex;align-items:center;justify-content:center">
        💬 Mở Zalo nhắn tin
      </a>
    </div>`;

  openModal(elModalZalo);
}

/** Gọi khi bấm nút "Nhận thưởng" trên header */
function claimFund() {
  openZaloModal();
}

/* ================================================================
   18. GẮN SỰ KIỆN
================================================================ */

// Upload file
elFileUpload.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = evt => {
    const parsed = parseLines(evt.target.result);
    if (parsed.length === 0) {
      elUploadHint.textContent = '❌ Không đọc được câu hỏi nào (sai định dạng?)';
      uploadedQuestions = [];
    } else {
      uploadedQuestions = parsed;
      elUploadHint.textContent = `✅ ${file.name} — ${parsed.length} câu hỏi`;
    }
  };
  reader.readAsText(file, 'UTF-8');
});

// Bắt đầu chơi
elBtnStart.addEventListener('click', startGame);

// Tải file mẫu
elBtnSample.addEventListener('click', downloadSample);

// Đáp án A/B/C/D
Object.entries(elAnswers).forEach(([key, btn]) => {
  btn.addEventListener('click', () => handleAnswer(key));
});

// Trợ giúp
elLL5050.addEventListener('click',  use5050);
elLLAud.addEventListener('click',   useAudience);
elLLPhone.addEventListener('click', usePhone);

// Dừng cuộc chơi
elBtnStop.addEventListener('click', () => {
  if (!isPlaying) return;
  isPlaying = false;
  setAnswersDisabled(true);
  setLifelinesDisabled(true);
  endGame('stop');
});

// Nhận thưởng
elBtnClaim.addEventListener('click', claimFund);

// Đóng modal trợ giúp
elModalLLClose.addEventListener('click', () => closeModal(elModalLL));

// Nút "Nhận thưởng" trong modal kết thúc ván → mở modal Zalo
elModalRWClaim.addEventListener('click', () => {
  closeModal(elModalRW);
  openZaloModal();
});

// Đóng modal Zalo
elModalZaloClose.addEventListener('click', () => closeModal(elModalZalo));

// Đóng modal thưởng → reset màn hình về trạng thái chờ
elModalRWClose.addEventListener('click', () => {
  closeModal(elModalRW);
  // Reset màn hình về trạng thái ban đầu
  elQuestionText.innerHTML = 'Nhấn <strong>"Bắt đầu chơi"</strong> để bắt đầu game.<br><small>Hãy tải file câu hỏi .txt trước.</small>';
  elQuestionNum.textContent  = 'Câu 1';
  elCurrentPrize.textContent = '100 VNĐ';
  elAnswerTexts.A.textContent = '—';
  elAnswerTexts.B.textContent = '—';
  elAnswerTexts.C.textContent = '—';
  elAnswerTexts.D.textContent = '—';
  Object.values(elAnswers).forEach(btn => {
    btn.className = 'answer-btn';
    btn.disabled  = false;
    btn.style.visibility = '';
  });
  setLifelinesDisabled(true);
  renderLadder();
});

/* ================================================================
   MODULE ÂM THANH — NHẠC NỀN + SFX (Web Audio API)
================================================================ */

// ── A. NHẠC NỀN (BGM) ──────────────────────────────────────────
const elBgm       = document.getElementById('bgm');
const elBgmUpload = document.getElementById('bgm-upload');

elBgm.volume = 0.4;
let musicOn  = false;

/** Phát nhạc nền — bọc trong try/catch để xử lý autoplay policy */
function bgmPlay() {
  if (!elBgm.src && !elBgm.querySelector('source[src]')) return; // không có src
  elBgm.play().then(() => {
    musicOn = true;
    elBtnMusic.textContent = '🎵 Nhạc: BẬT';
  }).catch(() => {
    // Trình duyệt chặn autoplay — giữ nguyên, người dùng phải bấm nút
  });
}

/** Tạm dừng nhạc nền */
function bgmPause() {
  elBgm.pause();
  musicOn = false;
  elBtnMusic.textContent = '🎵 Nhạc: TẮT';
}

/** Toggle nhạc nền */
function bgmToggle() {
  if (musicOn) {
    bgmPause();
  } else {
    bgmPlay();
  }
}

// Nút Bật/Tắt nhạc
elBtnMusic.addEventListener('click', bgmToggle);

// Nút "Chọn nhạc (.mp3)" — người dùng chọn file từ máy khi chưa có bgm.mp3
elBgmUpload.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  elBgm.src = url;
  elBgm.load();
  bgmPlay(); // tự phát ngay sau khi chọn
});

// ── B. SFX — WEB AUDIO API (100% offline, không file ngoài) ────
let audioCtx = null;

/** Lấy AudioContext — tạo lần đầu khi cần (tránh bị block trước gesture) */
function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume nếu bị suspended do autoplay policy
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

/**
 * Phát âm thanh tổng hợp bằng oscillator
 * @param {Array<{freq:number, dur:number, type:string, vol:number, delay:number}>} notes
 */
function playTone(notes) {
  try {
    const ctx = getAudioCtx();
    notes.forEach(({ freq, dur, type = 'sine', vol = 0.3, delay = 0 }) => {
      const osc   = ctx.createOscillator();
      const gain  = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type      = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur);

      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + dur + 0.05);
    });
  } catch (_) { /* SFX thất bại thì bỏ qua */ }
}

/** Bíp nhẹ khi click chọn đáp án */
function sfxSelect() {
  playTone([{ freq: 660, dur: 0.12, type: 'sine', vol: 0.25 }]);
}

/** Âm báo vui khi trả lời ĐÚNG — 3 nốt tăng dần */
function sfxCorrect() {
  playTone([
    { freq: 523, dur: 0.15, type: 'triangle', vol: 0.35, delay: 0    },
    { freq: 659, dur: 0.15, type: 'triangle', vol: 0.35, delay: 0.16 },
    { freq: 784, dur: 0.30, type: 'triangle', vol: 0.40, delay: 0.32 },
  ]);
}

/** Âm báo trầm khi trả lời SAI — 2 nốt giảm dần */
function sfxWrong() {
  playTone([
    { freq: 330, dur: 0.20, type: 'sawtooth', vol: 0.30, delay: 0    },
    { freq: 220, dur: 0.35, type: 'sawtooth', vol: 0.25, delay: 0.22 },
  ]);
}

// Click bên ngoài modal để đóng
[elModalLL, elModalRW, elModalZalo].forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal(overlay);
  });
});

/* ================================================================
   19. KHỞI TẠO KHI TRANG LOAD
================================================================ */
(function init() {
  renderLadder();
  setAnswersDisabled(false);  // cho phép click nhưng isPlaying=false sẽ chặn
  setLifelinesDisabled(true); // khoá trợ giúp cho đến khi bắt đầu
  elBtnStop.disabled = true;
  elUploadHint.textContent = 'Dùng câu hỏi mặc định (150 câu)';
  updateFundDisplay(); // hiển thị quỹ tích luỹ đã lưu từ localStorage
})();


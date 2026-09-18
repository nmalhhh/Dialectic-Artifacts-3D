export const STATIONS = [
  {
    id: '01',
    title: 'Khởi nguyên – Vật chất & Ý thức',
    subtitle: 'Vật chất & Ý thức',
    color: '#00f5ff',
    accentColor: '#00b8d9',
    camera: { position: [0, 0, 8], target: [0, 0, 0] },
    hud: [
      {
        label: 'Định nghĩa Vật chất (V.I.Lênin)',
        text: 'Vật chất là cái tồn tại khách quan bên ngoài ý thức và không phụ thuộc vào ý thức; là cái gây nên cảm giác ở con người gián tiếp hoặc trực tiếp lên giác quan. Cảm giác, tư duy, ý thức chỉ là sự phản ánh của vật chất.',
        icon: 'cpu',
      },
      {
        label: 'Mối quan hệ Biện chứng',
        text: 'Vật chất là tính thứ nhất, quyết định nguồn gốc, nội dung, bản chất và sự vận động, phát triển của ý thức. Ý thức có tính độc lập tương đối và tác động trở lại thế giới vật chất thông qua hoạt động thực tiễn.',
        icon: 'zap',
      },
    ],
    interaction: { type: 'button', label: 'Tác động thực tiễn' },
  },
  {
    id: '02',
    title: 'Vận động & Đứng im',
    subtitle: 'Thuộc tính tuyệt đối của vật chất',
    color: '#ffb800',
    accentColor: '#ff8c00',
    camera: { position: [0, 0, 10], target: [0, 0, 0] },
    hud: [
      {
        label: 'Vận động – Thuộc tính tuyệt đối',
        text: 'Vận động là tuyệt đối, vĩnh viễn, gắn liền với vật chất vô cùng vô tận. Vận động nói chung có xu hướng làm sự vật không ngừng biến đổi.',
        icon: 'activity',
      },
      {
        label: 'Đứng im – Trạng thái tương đối',
        text: 'Đứng im là sự vận động ở trạng thái cân bằng tạm thời, tương đối. Chỉ xảy ra trong 1 quan hệ nhất định, với 1 hình thức vận động nhất định, và chỉ biểu hiện khi sự vật còn là nó chưa biến đổi thành cái khác.',
        icon: 'pause-circle',
      },
    ],
    interaction: { type: 'slider', label: 'Tốc độ thời gian', min: 0, max: 2, step: 0.01 },
  },
  {
    id: '03',
    title: 'Hai Nguyên lý Biện chứng',
    subtitle: 'Mối liên hệ & Phát triển',
    color: '#a78bfa',
    accentColor: '#7c3aed',
    camera: { position: [0, 0, 10], target: [0, 0, 0] },
    hud: [
      {
        label: 'Nguyên lý Mối liên hệ phổ biến',
        text: 'Mọi sự vật, hiện tượng đều tác động qua lại, quy định và chuyển hóa lẫn nhau.',
        icon: 'share-2',
      },
      {
        label: 'Nguyên lý Sự phát triển',
        text: 'Quá trình vận động tiến lên từ thấp đến cao, từ đơn giản đến phức tạp, cái mới thay thế cái cũ.',
        icon: 'trending-up',
      },
    ],
    interaction: { type: 'hover', label: 'Hover nút mạng để kích hoạt gợn sóng' },
  },
  {
    id: '04',
    title: 'Quy luật Lượng – Chất',
    subtitle: 'Cơ chế vận động & Bước nhảy',
    color: '#fb923c',
    accentColor: '#ea580c',
    camera: { position: [0, 0, 10], target: [0, 0, 0] },
    hud: [
      {
        label: 'Độ & Điểm nút',
        text: 'Độ là khoảng giới hạn mà trong đó sự thay đổi về lượng chưa làm thay đổi căn bản về chất của sự vật. Điểm nút là thời điểm mà tại đó sự thay đổi về lượng đủ để làm thay đổi về chất.',
        icon: 'thermometer',
      },
      {
        label: 'Bước nhảy',
        text: 'Bước nhảy là sự chuyển hóa về chất của sự vật do sự tích lũy về lượng trước đó gây ra; kết thúc một giai đoạn phát triển và mở đầu một giai đoạn phát triển mới (là sự đứt đoạn trong tính tiệm tiến về lượng).',
        icon: 'zap',
      },
    ],
    interaction: { type: 'hold-button', label: 'Nung nhiệt (Tích lũy lượng)' },
  },
  {
    id: '05',
    title: 'Quy luật Mâu thuẫn',
    subtitle: 'Hạt nhân Biện chứng',
    color: '#ff2d55',
    accentColor: '#ff6b35',
    camera: { position: [0, 0, 10], target: [0, 0, 0] },
    hud: [
      {
        label: 'Thống nhất & Đấu tranh',
        text: 'Thống nhất giữa các mặt đối lập là sự nương tựa, làm tiền đề cho nhau tồn tại và có sự tương đồng. Đấu tranh là sự tác động qua lại theo hướng bài trừ, phủ định lẫn nhau giữa các mặt đối lập.',
        icon: 'git-branch',
      },
      {
        label: 'Động lực phát triển',
        text: 'Sự thống nhất và đấu tranh giữa các mặt đối lập là nguyên nhân, động lực bên trong của sự vận động và phát triển, làm cho cái cũ mất đi và cái mới ra đời (sự vận động, phát triển là tự thân).',
        icon: 'atom',
      },
    ],
    interaction: { type: 'slider', label: 'Khoảng cách cực', min: 1.5, max: 6, step: 0.05 },
  },
  {
    id: '06',
    title: 'Quy luật Phủ định',
    subtitle: 'Phủ định của phủ định',
    color: '#34d399',
    accentColor: '#059669',
    camera: { position: [0, 0, 12], target: [0, 4, 0] },
    hud: [
      {
        label: 'Khuynh hướng phát triển',
        text: 'Khuynh hướng phát triển diễn ra theo đường xoáy ốc tiến lên, quanh co, phức tạp chứ không phải đường thẳng.',
        icon: 'refresh-cw',
      },
      {
        label: 'Phủ định biện chứng',
        text: 'Phủ định biện chứng mang tính khách quan và kế thừa: loại bỏ cái lỗi thời, giữ lại và cải tạo những hạt nhân tích cực.',
        icon: 'trending-up',
      },
    ],
    interaction: { type: 'scroll', label: 'Kéo để bay theo đường xoắn ốc' },
  },
  {
    id: '07',
    title: 'Sáu Cặp Phạm Trù',
    subtitle: 'Ma trận Hypercube',
    color: '#c084fc',
    accentColor: '#9333ea',
    camera: { position: [0, 0, 10], target: [0, 0, 0] },
    hud: [
      {
        label: 'Phạm trù triết học',
        text: 'Hệ thống công cụ phản ánh các mối liên hệ phổ biến nhất, định hướng phương pháp luận khoa học.',
        icon: 'layers',
      },
    ],
    interaction: { type: 'click', label: 'Click mặt để xem phạm trù' },
    cards: [
      {
        title: 'Cái riêng – Cái chung',
        desc: 'Cái chung chỉ tồn tại trong cái riêng và thông qua cái riêng. Cái riêng bao giờ cũng mang đặc tính của cái chung.',
        icon: '⬡',
      },
      {
        title: 'Nguyên nhân – Kết quả',
        desc: 'Nguyên nhân là cái sinh ra kết quả. Quan hệ nhân-quả mang tính tất yếu, khách quan và đa dạng.',
        icon: '→',
      },
      {
        title: 'Tất nhiên – Ngẫu nhiên',
        desc: 'Tất nhiên là cái nhất định phải xảy ra do bản chất bên trong quy định. Ngẫu nhiên là cái có thể xảy ra hoặc không.',
        icon: '⚄',
      },
      {
        title: 'Nội dung – Hình thức',
        desc: 'Nội dung quyết định hình thức. Hình thức tác động trở lại nội dung, thúc đẩy hoặc kìm hãm sự phát triển.',
        icon: '◎',
      },
      {
        title: 'Bản chất – Hiện tượng',
        desc: 'Bản chất là cái bên trong, tương đối ổn định. Hiện tượng là cái bên ngoài, phong phú và đa dạng hơn bản chất.',
        icon: '◈',
      },
      {
        title: 'Khả năng – Hiện thực',
        desc: 'Hiện thực là cái đang tồn tại thực sự. Khả năng là cái chưa có nhưng sẽ có khi điều kiện thích hợp.',
        icon: '◇',
      },
    ],
  },
];

export const CAMERA_POSITIONS = STATIONS.map((s) => s.camera);

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      action, // 'generate_variants' or 'generate_content' (default)
      name,
      categoryName,
      description,
      basePrice,
      salePrice,
      isCustomizable,
      occasions,
      recipients,
      specs,
      includedItems,
      customPrompt
    } = body;

    const apiKey = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY is not configured in the environment variables.' },
        { status: 500 }
      );
    }

    if (action === 'generate_post') {
      const systemPrompt = `Bạn là một chuyên gia viết nội dung Marketing, nhà văn và chuyên viên tối ưu hóa SEO cho thương hiệu Haniu (thương hiệu quà tặng cao cấp, tình cảm, tinh tế).
Nhiệm vụ của bạn là viết một bài viết (blog post) chất lượng cao, chuẩn SEO, có độ dài khoảng 1000 từ dựa trên chủ đề hoặc từ khóa được cung cấp.

Yêu cầu cực kỳ quan trọng về nội dung:
- Phải viết bằng TIẾNG VIỆT, văn phong lôi cuốn, chuyên nghiệp nhưng ấm áp, gần gũi, đong đầy cảm xúc.
- Bài viết phải dài khoảng 1000 từ (rất chi tiết, phân tích sâu, có ví dụ cụ thể), có bố cục rõ ràng với các tiêu đề phụ (H2, H3).
- Cung cấp nội dung dưới dạng HTML sạch (sử dụng các thẻ h2, h3, p, strong, em, ul, li, blockquote, khuyên dùng định dạng HTML chuẩn không cần thẻ bao ngoài body hay html).
- Trả về cấu trúc JSON chính xác theo định dạng dưới đây. Không thêm giải thích ngoài JSON.

MẪU JSON TRẢ VỀ:
{
  "title": "Tiêu đề bài viết hấp dẫn, thu hút người đọc",
  "slug": "duong-dan-tinh-viet-lien-khong-dau-ngan-cach-bang-dau-gach-ngang",
  "summary": "Tóm tắt ngắn gọn nội dung bài viết hiển thị ngoài danh sách (khoảng 2-3 câu, từ 100 đến 150 từ)...",
  "imageUrl": "https://images.unsplash.com/photo-...", (Tìm một URL hình ảnh Unsplash thật chất lượng liên quan đến quà tặng/tình yêu/chủ đề bài viết để làm ảnh đại diện)
  "content": "Nội dung bài viết chi tiết khoảng 1000 từ..."
}`;

      const userPrompt = `Chủ đề bài viết: "${body.topic || ''}"
Tone giọng mong muốn: "${body.tone || 'Lãng mạn, sâu sắc'}"
Yêu cầu bổ sung đặc biệt: "${body.customPrompt || 'Không có'}"

Hãy viết bài viết dài khoảng 1000 từ, đầy tính thuyết phục và cảm xúc.`;

      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          temperature: 0.7,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
        }),
      });

      if (!groqResponse.ok) {
        const errText = await groqResponse.text();
        return NextResponse.json({ error: `Groq error: ${errText}` }, { status: groqResponse.status });
      }

      const data = await groqResponse.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) return NextResponse.json({ error: 'Empty AI response' }, { status: 500 });
      return NextResponse.json(JSON.parse(content));
    }

    if (action === 'generate_variants') {
      const systemPrompt = `Bạn là một chuyên gia quản lý sản phẩm E-commerce cho thương hiệu Haniu.
Nhiệm vụ của bạn là sinh ra danh sách các biến thể (variants) phù hợp, thực tế và bán chạy cho sản phẩm quà tặng dựa trên Tên sản phẩm, Danh mục, Mô tả và Giá bán.

Yêu cầu:
- Phải sinh bằng TIẾNG VIỆT.
- Trả về tối đa 3-6 biến thể phù hợp nhất.
- Mỗi biến thể có thuộc tính: name (Tên biến thể, vd: "Hộp Xanh Size M", "Cốc Hồng 350ml"), sku (Mã SKU viết hoa không dấu cách, tự đặt dựa trên tên sản phẩm và thuộc tính), color (Màu sắc), size (Kích thước), material (Chất liệu), price (Giá bán lẻ bằng số, tham khảo giá gốc sản phẩm), stock (Số lượng tồn kho, mặc định là 10).
- Trả về cấu trúc JSON chính xác theo định dạng dưới đây. Không thêm giải thích ngoài JSON.

MẪU JSON TRẢ VỀ:
{
  "variants": [
    {
      "name": "...",
      "sku": "...",
      "color": "...",
      "size": "...",
      "material": "...",
      "price": 250000,
      "stock": 10
    }
  ]
}`;

      const userPrompt = `Tên sản phẩm: "${name}"
Danh mục: "${categoryName}"
Mô tả quà tặng: "${description || ''}"
Giá gốc: ${basePrice || 0} VNĐ
${customPrompt ? `Yêu cầu cụ thể từ người dùng khi tạo biến thể: "${customPrompt}"` : ''}

Hãy tự động đề xuất danh sách các biến thể sản phẩm hợp lý.`;

      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          temperature: 0.5,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
        }),
      });

      if (!groqResponse.ok) {
        const errText = await groqResponse.text();
        return NextResponse.json({ error: `Groq error: ${errText}` }, { status: groqResponse.status });
      }

      const data = await groqResponse.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) return NextResponse.json({ error: 'Empty AI response' }, { status: 500 });
      return NextResponse.json(JSON.parse(content));
    }

    // Default flow: generate_content
    const systemPrompt = `Bạn là một chuyên gia viết nội dung Marketing, nhà văn viết truyện lãng mạn và chuyên viên tối ưu hóa SEO cho thương hiệu quà tặng Haniu.
Nhiệm vụ của bạn là sinh ra thông tin sản phẩm và cấu hình chi tiết (JSON) dựa trên Tên sản phẩm và Danh mục được cung cấp.

Yêu cầu cực kỳ quan trọng về nội dung:
- Phải sinh hoàn toàn bằng TIẾNG VIỆT, văn phong cực kỳ lãng mạn, ấm áp, sâu sắc, đong đầy tình cảm yêu thương ("Món quà yêu thương").
- Mặc định chủ đề là viết về món quà kết nối trái tim, mang thông điệp tình yêu lãng mạn, sự trân quý giữa người tặng và người nhận.
- Các mục câu chuyện sản phẩm (trong phần seoDescription.sections) BẮT BUỘC phải viết rất dài, chi tiết, mang tính tự sự, văn xuôi bay bổng (tối thiểu 150-250 từ cho mỗi mục). Hãy kể câu chuyện đầy đủ và giải thích sâu sắc lý do "Tại sao nên chọn sản phẩm này làm món quà trao gửi yêu thương", mô tả hành trình cảm xúc từ khi chuẩn bị quà đến khi trao đi.
- Các chính sách (đổi trả, bảo hành, bảo quản, khắc laser, FAQ) phải thực tế và phù hợp với loại sản phẩm quà tặng này.

Bạn BẮT BUỘC phải trả về cấu trúc JSON chính xác theo mẫu dưới đây. Không thêm bất kỳ văn bản giải thích nào ngoài khối JSON.

MẪU JSON CẦN TRẢ VỀ:
{
  "seoTitle": "Tiêu đề SEO tối ưu (dưới 65 ký tự)",
  "seoKeywords": "từ khóa 1, từ khóa 2, từ khóa 3",
  "seoDescription": "Mô tả SEO tóm tắt (dưới 160 ký tự)",
  "layoutConfig": {
    "showSeoDescription": true,
    "seoDescription": {
      "title": "📖 Chi tiết sản phẩm & Câu chuyện thương hiệu",
      "sections": [
        { "icon": "🎁", "title": "Ý nghĩa món quà [Tên sản phẩm]", "content": "[Nội dung ý nghĩa món quà..." },
        { "icon": "💎", "title": "Chất liệu cao cấp & Thiết kế", "content": "[Nội dung chất liệu..." },
        { "icon": "🛠️", "title": "Quy trình chế tác thủ công", "content": "[Nội dung chế tác thủ công..." },
        { "icon": "🌱", "title": "Hướng dẫn bảo quản sản phẩm", "content": "[Nội dung bảo quản..." },
        { "icon": "📜", "title": "Câu chuyện sản phẩm Haniu", "content": "[Nội dung câu chuyện sản phẩm..." }
      ]
    },
    "showPolicies": true,
    "policies": {
      "showReturns": true,
      "returns": {
        "title": "🔄 Cam kết đổi trả trong vòng 7 ngày",
        "content": "Haniu cam kết đổi trả sản phẩm mới 100% hoặc hoàn tiền..."
      },
      "showWarranty": true,
      "warranty": {
        "title": "🛡️ Thời hạn bảo hành sản phẩm",
        "content": "Bảo hành 6-12 tháng đối với các lỗi kỹ thuật từ nhà sản xuất..."
      },
      "showCare": true,
      "care": {
        "title": "🌱 Hướng dẫn bảo quản lâu dài",
        "content": "Tránh ẩm ướt, lau bằng khăn mềm..."
      },
      "showEngraving": false,
      "engraving": {
        "title": "✍️ Hướng dẫn yêu cầu thiết kế khắc Laser",
        "content": "Hỗ trợ khắc tên miễn phí dưới 30 ký tự..."
      },
      "showFaq": true,
      "faq": {
        "title": "💬 Các câu hỏi thường gặp",
        "content": [
          { "question": "Tôi có được duyệt mẫu trước khi khắc không?", "answer": "Có, nhân viên sẽ gửi mẫu qua Zalo cho bạn..." },
          { "question": "Thời gian giao hàng mất bao lâu?", "answer": "Giao hỏa tốc 2h tại Hà Nội, 2-4 ngày toàn quốc..." },
          { "question": "Có cung cấp hóa đơn VAT không?", "answer": "Có hỗ trợ xuất hóa đơn VAT cho doanh nghiệp..." }
        ]
      }
    },
    "promotionsConfig": {
      "show": true,
      "list": [
        "Miễn phí vận chuyển đơn hàng từ 499k",
        "Tặng thiệp viết tay miễn phí",
        "Giảm 10% khi mua từ 2 sản phẩm"
      ]
    },
    "whyChooseUsConfig": {
      "show": true,
      "list": [
        { "icon": "✨", "text": "Chất lượng tinh tuyển hàng đầu" },
        { "icon": "🎁", "text": "Hộp quà thiết kế sang trọng" },
        { "icon": "✍️", "text": "Cá nhân hóa khắc tên miễn phí" },
        { "icon": "🚚", "text": "Giao hàng hỏa tốc an tâm" }
      ]
    },
    "deliveryPolicyConfig": {
      "show": true,
      "list": {
        "lines": [
          { "label": "Nội thành Hà Nội", "value": "2 - 4 giờ" },
          { "label": "Các tỉnh thành khác", "value": "2 - 4 ngày" }
        ],
        "bulletPoints": [
          "Hỗ trợ đồng kiểm trước khi nhận hàng",
          "Đóng gói chống va đập chuyên nghiệp"
        ]
      }
    },
    "brandCommitmentConfig": {
      "show": true,
      "list": [
        "Sản phẩm thực tế đẹp như hình",
        "Bảo hành chu đáo, tin cậy",
        "Hỗ trợ đổi trả nhanh chóng"
      ]
    }
  }
}`;

    const userPrompt = `Hãy đọc kỹ toàn bộ thông tin sản phẩm dưới đây để sinh nội dung phù hợp nhất:

Tên sản phẩm: "${name}"
Danh mục: "${categoryName}"
Mô tả quà tặng: "${description || ''}"
Giá gốc: ${basePrice || 0} VNĐ
Giá khuyến mại: ${salePrice || 'Không có'}
Có thể cá nhân hóa/khắc tên: ${isCustomizable ? 'Có' : 'Không'}
Dịp lễ thích hợp: ${Array.isArray(occasions) ? occasions.join(', ') : 'Chưa thiết lập'}
Người nhận thích hợp: ${Array.isArray(recipients) ? recipients.join(', ') : 'Chưa thiết lập'}
Thông số kỹ thuật: ${Array.isArray(specs) ? specs.map((s: any) => `${s.key}: ${s.value}`).join(', ') : 'Chưa thiết lập'}
Chi tiết bộ quà tặng gồm: ${Array.isArray(includedItems) ? includedItems.map((i: any) => `${i.key}: ${i.value}`).join(', ') : 'Chưa thiết lập'}

${customPrompt ? `Yêu cầu bổ sung đặc biệt của người dùng: "${customPrompt}"` : ''}

Dựa trên tất cả các thông tin trên, hãy sinh câu chuyện sản phẩm, lý do "tại sao nên chọn" thật lãng mạn, ấm áp, sâu sắc và đầy đủ các trường SEO & Layout Config theo đúng định dạng JSON yêu cầu.`;

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        temperature: 0.7,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      return NextResponse.json(
        { error: `Groq API responded with error: ${errText}` },
        { status: groqResponse.status }
      );
    }

    const data = await groqResponse.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: 'Empty response from AI model.' }, { status: 500 });
    }

    const parsedResult = JSON.parse(content);
    return NextResponse.json(parsedResult);

  } catch (error: any) {
    console.error('Error generating AI content:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

const API_KEY = 'sk-cp-sNy6EkGTdMG6uPxGzn4mPBMGFk_1t5P0CB8R1ZOGNRqT-pEeQgcTJK63wyERuqXaajeOLo_rRg0YGxrF_Be71wXs781-Z--_nNSwAER1I1QR_4nTZj0FuBY';
const API_URL = 'https://api.minimax.chat/v1/chat/completions';

function generateId() {
  return 'q_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

export async function generateQuestions(courseName, outline, questionTypes) {
  const typeLabels = {
    single: '单选题',
    multiple: '多选题',
    fill: '填空题',
    essay: '简答题'
  };

  const requirements = [];
  for (const [type, config] of Object.entries(questionTypes)) {
    const count = typeof config === 'object' ? config.count : config;
    const score = typeof config === 'object' ? config.score : (type === 'single' ? 5 : type === 'multiple' ? 10 : type === 'fill' ? 5 : 15);
    if (count > 0) {
      requirements.push(`${count}道${typeLabels[type]}（每题${score}分）`);
    }
  }

  const prompt = `你是一个专业的培训题目出题专家。请根据以下课程信息，生成合适的培训考核题目。

课程名称：${courseName}

课程纲要：
${outline}

请生成以下题型的题目：
${requirements.join('、')}

要求：
1. 题目内容要基于课程纲要，考察员工对培训内容的掌握程度
2. 题目难度适中，适合职场新人
3. 多选题的答案可能是多个选项
4. 只返回JSON格式，不要包含其他文字

请严格按照以下JSON格式返回：
{
  "questions": [
    {
      "type": "single",
      "content": "题目内容",
      "options": ["A. 选项1", "B. 选项2", "C. 选项3", "D. 选项4"],
      "answer": "A",
      "score": 5
    },
    {
      "type": "multiple",
      "content": "题目内容",
      "options": ["A. 选项1", "B. 选项2", "C. 选项3", "D. 选项4"],
      "answer": ["A", "C"],
      "score": 10
    },
    {
      "type": "fill",
      "content": "题目内容，将答案留空用____表示",
      "answer": "正确答案",
      "score": 5
    },
    {
      "type": "essay",
      "content": "题目内容",
      "answer": "参考答案要点",
      "score": 15
    }
  ]
}`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'MiniMax-M2.7',
        max_tokens: 4000,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('MiniMax API error:', response.status, errorText);
      throw new Error(`API请求失败: ${response.status}`);
    }

    const data = await response.json();
    console.log('MiniMax API raw response:', JSON.stringify(data, null, 2));

    let assistantContent = data.choices?.[0]?.message?.content || data.choices?.[0]?.text;
    if (!assistantContent && data.output?.text) {
      assistantContent = data.output?.text;
    }

    if (!assistantContent) {
      console.error('No content found in API response. Available keys:', Object.keys(data), 'base_resp:', data.base_resp);
      throw new Error('API返回内容为空: ' + (data.base_resp?.status_msg || '未知错误'));
    }

    let jsonStr = assistantContent.trim();
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }

    const result = JSON.parse(jsonStr);
    const questions = result.questions.map(q => ({
      ...q,
      id: generateId()
    }));

    return questions;
  } catch (error) {
    console.error('Generate questions error:', error);
    throw new Error('AI生成题目失败: ' + error.message);
  }
}

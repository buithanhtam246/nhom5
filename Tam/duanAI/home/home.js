// This file previously contained the full HTML for the home page.
// The canonical HTML is now in `home/home.html`.
// Keeping a small JS placeholder here to avoid editor confusion.

        const quotes = [
            { text: "Đừng chờ đợi cơ hội, hãy tạo ra nó bằng chính nỗ lực của bạn.", author: "AI Advice for Career" },
            { text: "Sự sáng tạo là trí thông minh đang vui đùa.", author: "Albert Einstein (AI Curated)" },
            { text: "Trong kỷ nguyên số, sự đồng cảm là thuật toán mạnh mẽ nhất.", author: "AI Perspective" },
            { text: "Thất bại chỉ là một bước đệm, không phải là điểm dừng.", author: "Motivation Core" },
            { text: "Tương lai thuộc về những người tin vào vẻ đẹp của giấc mơ.", author: "Eleanor Roosevelt" },
            { text: "Hãy học cách nghỉ ngơi, không phải bỏ cuộc.", author: "Mental Health AI" }
        ];

        function generateQuote() {
            const textElem = document.getElementById('quote-text');
            const authorElem = document.getElementById('quote-author');
            
            // Fade out
            textElem.style.opacity = 0;
            authorElem.style.opacity = 0;

            setTimeout(() => {
                // Get random quote
                const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
                
                // Update text
                textElem.innerText = `"${randomQuote.text}"`;
                authorElem.innerText = `— ${randomQuote.author}`;
                
                // Fade in
                textElem.style.opacity = 1;
                authorElem.style.opacity = 1;
            }, 500);
        }

        // -------------------------
        // Chat integration for topics
        // -------------------------

        let currentTopic = null;
        const chatModal = () => document.getElementById('chat-modal');
        const chatMessages = () => document.getElementById('chat-messages');
        const chatInput = () => document.getElementById('chat-input');
        const chatSuggestions = () => document.getElementById('chat-suggestions');

        // Gợi ý câu hỏi cho mỗi chủ đề
        const topicSuggestions = {
            'Sự nghiệp': [
                'Làm sao để phát triển kỹ năng lãnh đạo?',
                'Tôi nên chọn công việc ổn định hay theo đuổi đam mê?',
                'Cách xin tăng lương hiệu quả?',
                'Làm thế nào để cân bằng công việc và học hỏi?'
            ],
            'Tình yêu': [
                'Làm sao để duy trì tình yêu lâu dài?',
                'Cách vượt qua chia tay?',
                'Làm thế nào để xây dựng niềm tin trong quan hệ?',
                'Khi nào nên bắt đầu một mối quan hệ mới?'
            ],
            'Cuộc sống': [
                'Làm sao để sống hạnh phúc hơn?',
                'Cách quản lý thời gian hiệu quả?',
                'Làm thế nào để giảm căng thẳng?',
                'Cách xây dựng thói quen tốt?'
            ],
            'Sáng tạo': [
                'Làm sao để khơi nguồn sáng tạo?',
                'Cách vượt qua writer\'s block?',
                'Làm thế nào để học một kỹ năng nghệ thuật mới?',
                'Cách biến ý tưởng thành hiện thực?'
            ]
        };

        function showSuggestions(topic) {
            const suggestions = topicSuggestions[topic] || [];
            const container = chatSuggestions();
            container.innerHTML = '';
            
            suggestions.forEach(suggestion => {
                const btn = document.createElement('button');
                btn.className = 'text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-full transition';
                btn.innerText = suggestion;
                btn.onclick = () => {
                    chatInput().value = suggestion;
                    container.innerHTML = ''; // Hide suggestions after click
                };
                container.appendChild(btn);
            });
        }

        function openChat(topic) {
            currentTopic = topic;
            document.getElementById('chat-topic').innerText = `AI trợ giúp — ${topic}`;
            document.getElementById('chat-sub').innerText = `Hỏi về "${topic}" để nhận gợi ý, lời khuyên hoặc ý tưởng.`;
            chatMessages().innerHTML = '';
            chatInput().value = '';
            showSuggestions(topic);
            const modal = chatModal();
            modal.style.display = 'flex';
        }

        function closeChat() {
            chatModal().style.display = 'none';
        }

        function openBotChat() {
            currentTopic = 'Trợ lý AI';
            document.getElementById('chat-topic').innerText = '🤖 Trợ lý AI của bạn';
            document.getElementById('chat-sub').innerText = 'Hỏi tôi bất cứ điều gì! Tôi sẵn sàng giúp đỡ bạn.';
            chatMessages().innerHTML = '';
            chatInput().value = '';
            
            // Welcome message from bot
            setTimeout(() => {
                appendMessage('assistant', 'Xin chào! Tôi là trợ lý AI của MindAI. Tôi có thể giúp bạn với:\n\n📚 Sự nghiệp & học tập\n💕 Tình yêu & quan hệ\n🌟 Cuộc sống & phát triển bản thân\n💡 Sáng tạo & nghệ thuật\n\nBạn muốn hỏi gì nhé?');
            }, 300);
            
            // Clear suggestions for general bot chat
            chatSuggestions().innerHTML = '';
            
            const modal = chatModal();
            modal.style.display = 'flex';
        }

        function appendMessage(role, text, isLoading = false) {
            const wrap = document.createElement('div');
            wrap.className = role === 'user' ? 'text-right' : 'text-left';
            const bubble = document.createElement('div');
            bubble.className = role === 'user' ? 'inline-block bg-purple-700 text-white px-4 py-2 rounded-2xl' : 'inline-block bg-slate-800 text-slate-200 px-4 py-2 rounded-2xl';
            
            if (isLoading) {
                // Add typing animation (3 bouncing dots)
                bubble.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
                bubble.setAttribute('data-loading', 'true');
            } else {
                bubble.innerText = text;
            }
            
            wrap.appendChild(bubble);
            chatMessages().appendChild(wrap);
            chatMessages().scrollTop = chatMessages().scrollHeight;
            return wrap;
        }
        
        function removeLoadingMessages() {
            const msgs = chatMessages().children;
            for (let i = msgs.length - 1; i >= 0; i--) {
                const bubble = msgs[i].querySelector('[data-loading="true"]');
                if (bubble) {
                    msgs[i].remove();
                    break;
                }
            }
        }

        async function sendMessage() {
            const text = chatInput().value.trim();
            if (!text) return;
            
            // Hide suggestions after first message
            chatSuggestions().innerHTML = '';
            
            appendMessage('user', text);
            chatInput().value = '';

            // Show typing indicator (3 bouncing dots)
            appendMessage('assistant', '', true);

            try {
                // Explicitly target the Express proxy running on port 3000.
                // If you run the server with `npm start` it serves the API at http://localhost:3000
                const API_BASE = 'http://localhost:3000';
                const res = await fetch(API_BASE + '/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ topic: currentTopic || 'General', message: text })
                });

                // Remove typing indicator
                removeLoadingMessages();

                if (!res.ok) {
                    const errText = await res.text();
                    let userMessage = 'Có lỗi xảy ra. Vui lòng thử lại.';
                    
                    // Parse error for better messages
                    try {
                        const errJson = JSON.parse(errText);
                        if (errJson.error && errJson.error.code === 'insufficient_quota') {
                            userMessage = '⚠️ API key đã hết quota. Vui lòng:\n1. Kiểm tra billing tại platform.openai.com\n2. Thêm payment method\n3. Tạo API key mới';
                        } else if (errJson.error && errJson.error.message) {
                            userMessage = 'Lỗi: ' + errJson.error.message;
                        }
                    } catch {
                        userMessage = 'Lỗi: ' + errText.substring(0, 200);
                    }
                    
                    appendMessage('assistant', userMessage);
                    return;
                }

                const data = await res.json();
                appendMessage('assistant', data.reply || 'Không có phản hồi từ AI.');
            } catch (err) {
                // Remove typing indicator on error
                removeLoadingMessages();
                appendMessage('assistant', '❌ Không thể kết nối: ' + err.message);
            }
        }

        // allow pressing Enter to send (Shift+Enter for newline)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                const active = document.activeElement;
                if (active === chatInput()) {
                    e.preventDefault();
                    sendMessage();
                }
            }
        });


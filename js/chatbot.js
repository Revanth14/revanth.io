class PortfolioChatbot {
    constructor() {
        this.isOpen = false;
        this.isTyping = false;
        this.knowledgeBase = null;
        this.conversationHistory = [];
        this.isEnhanced = false;
        this.totalTokens = 0;
        this.conversationId = this.generateConversationId();
        
        this.init();
    }

    async init() {
        // Load knowledge base
        await this.loadKnowledgeBase();
        
        // Create chatbot UI
        this.createChatbotHTML();
        
        // Bind events
        this.bindEvents();
        
        // Show intro message after a delay and automatically enable enhanced mode
        setTimeout(() => {
            this.addMessage("Hello! 👋 I'm Revanth's AI assistant. Feel free to ask me about his experience, skills, projects, or anything else you'd like to know!", 'bot');
            
            // Automatically enable enhanced mode
            if (window.chatbotConfig && window.chatbotConfig.isApiConfigured()) {
                this.enableEnhancedMode();
            }
        }, 2000);
    }

    async loadKnowledgeBase() {
        try {
            const response = await fetch('/js/knowledge-base.json');
            this.knowledgeBase = await response.json();
        } catch (error) {
            console.error('Failed to load knowledge base:', error);
            this.knowledgeBase = this.getFallbackKnowledgeBase();
        }
    }

    getFallbackKnowledgeBase() {
        return {
            personal: {
                name: "Revanth",
                title: "Cloud & Data Engineer",
                experience: "7+ years",
                location: "Available for remote opportunities",
                email: "eswarrevanth@gmail.com",
                linkedin: "https://www.linkedin.com/in/revanthch14/",
                github: "https://github.com/revanth14"
            },
            skills: {
                dataEngineering: ["Apache Spark", "Apache Kafka", "Apache Airflow", "dbt", "Databricks", "Snowflake", "ETL/ELT Pipelines"],
                aws: ["EC2 & Lambda", "S3 & Glacier", "EMR", "Glue & Athena", "Kinesis", "Redshift", "RDS & DynamoDB"],
                devops: ["Docker", "Kubernetes", "Terraform", "Jenkins", "GitLab CI/CD", "GitHub Actions"],
                programming: ["Python", "SQL", "Scala", "Shell Scripting", "PySpark"]
            },
            certifications: [
                "AWS Cloud Practitioner",
                "AWS AI Practitioner", 
                "AWS Data Engineer Associate",
                "AWS Solutions Architect Associate"
            ],
            projects: [
                {
                    name: "Real-Time Data Pipeline",
                    description: "Built a scalable real-time data pipeline processing 10M+ events daily using Kafka, Spark Streaming, and AWS services.",
                    tech: ["Apache Kafka", "Spark Streaming", "AWS Kinesis", "Python"]
                },
                {
                    name: "Data Lake Architecture",
                    description: "Designed and implemented a cloud-native data lake on AWS handling 50TB+ of data with automated ingestion pipelines.",
                    tech: ["AWS S3", "AWS Glue", "Athena", "Terraform"]
                }
            ],
            quickQuestions: [
                "What's your experience with AWS?",
                "Tell me about your data engineering projects",
                "What certifications do you have?",
                "How can I contact you?",
                "What's your experience with Python?"
            ]
        };
    }

    createChatbotHTML() {
        const chatbotHTML = `
            <div id="chatbot-container" class="chatbot-container">
                <!-- Chat Bubble -->
                <div id="chatbot-bubble" class="chatbot-bubble">
                    <div class="bubble-content">
                        <span class="bubble-icon">💬</span>
                        <span class="bubble-text">Ask me about Revanth!</span>
                    </div>
                    <div class="bubble-notification" id="chatbot-notification">1</div>
                </div>

                <!-- Chat Window -->
                <div id="chatbot-window" class="chatbot-window">
                    <div class="chatbot-header">
                        <div class="header-info">
                            <div class="avatar">R</div>
                            <div class="header-text">
                                <h4>Revanth's Assistant</h4>
                                <span class="status">Online</span>
                            </div>
                        </div>
                        <button id="chatbot-minimize" class="minimize-btn">−</button>
                    </div>

                    <div id="chatbot-messages" class="chatbot-messages">
                        <!-- Messages will be inserted here -->
                    </div>


                    <div class="chatbot-input-container">
                        <input 
                            type="text" 
                            id="chatbot-input" 
                            class="chatbot-input" 
                            placeholder="Type your question..." 
                            maxlength="500"
                        >
                        <button id="chatbot-send" class="chatbot-send">
                            <span class="send-icon">➤</span>
                        </button>
                    </div>

                    <div class="chatbot-footer">
                        <span>Powered by AI • Chat with Revanth's assistant</span>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    bindEvents() {
        const bubble = document.getElementById('chatbot-bubble');
        const minimizeBtn = document.getElementById('chatbot-minimize');
        const sendBtn = document.getElementById('chatbot-send');
        const input = document.getElementById('chatbot-input');

        bubble.addEventListener('click', () => this.toggleChat());
        minimizeBtn.addEventListener('click', () => this.toggleChat());
        sendBtn.addEventListener('click', () => this.sendMessage());
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });


    }

    toggleChat() {
        const window = document.getElementById('chatbot-window');
        const bubble = document.getElementById('chatbot-bubble');
        const notification = document.getElementById('chatbot-notification');

        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            window.classList.add('open');
            bubble.classList.add('hidden');
            notification.style.display = 'none';
            document.getElementById('chatbot-input').focus();
        } else {
            window.classList.remove('open');
            bubble.classList.remove('hidden');
        }
    }


    async sendMessage(messageText = null) {
        const input = document.getElementById('chatbot-input');
        const message = messageText || input.value.trim();

        if (!message) return;

        // Clear input
        input.value = '';

        // Add user message
        this.addMessage(message, 'user');


        // Store in conversation history
        this.conversationHistory.push({ role: 'user', content: message });

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Get bot response
            const response = await this.getBotResponse(message);
            
            // Remove typing indicator
            this.hideTypingIndicator();
            
            // Add bot response
            this.addMessage(response, 'bot');
            
            // Store bot response in history
            this.conversationHistory.push({ role: 'assistant', content: response });
            
        } catch (error) {
            console.error('Error getting bot response:', error);
            this.hideTypingIndicator();
            this.addMessage("I apologize, but I'm having trouble responding right now. Please try again later or feel free to contact Revanth directly at eswarrevanth@gmail.com", 'bot');
        }
    }

    async getBotResponse(message) {
        // If enhanced mode is enabled, try OpenAI first for better responses
        if (this.isEnhanced && window.chatbotConfig && window.chatbotConfig.isApiConfigured()) {
            try {
                return await this.getOpenAIResponse(message);
            } catch (error) {
                console.error('OpenAI API error, falling back to local response:', error);
                // Fall back to local response if API fails
            }
        }

        // Try to get a local response
        const localResponse = this.getLocalResponse(message);
        if (localResponse) {
            return localResponse;
        }

        // Final fallback
        return this.getFallbackResponse(message);
    }

    getLocalResponse(message) {
        const msg = message.toLowerCase();
        const kb = this.knowledgeBase;

        // Contact information
        if (msg.includes('contact') || msg.includes('email') || msg.includes('reach')) {
            return `You can reach Revanth at:\n\n📧 Email: ${kb.personal.email}\n💼 LinkedIn: ${kb.personal.linkedin}\n🐙 GitHub: ${kb.personal.github}`;
        }

        // Experience
        if (msg.includes('experience') || msg.includes('years')) {
            return `Revanth has ${kb.personal.experience} of experience as a ${kb.personal.title}. He specializes in building scalable infrastructure and data solutions that drive business value.`;
        }

        // AWS specific
        if (msg.includes('aws') || msg.includes('amazon')) {
            const awsSkills = kb.skills.aws.join(', ');
            const certs = kb.certifications.filter(cert => cert.includes('AWS')).join(', ');
            return `Revanth has extensive AWS experience with services including: ${awsSkills}.\n\nHe holds these AWS certifications: ${certs}`;
        }

        // Certifications
        if (msg.includes('certification') || msg.includes('certified')) {
            return `Revanth holds the following certifications:\n\n${kb.certifications.map(cert => `🏆 ${cert}`).join('\n')}`;
        }

        // Data Engineering
        if (msg.includes('data engineer') || msg.includes('data pipeline') || msg.includes('etl')) {
            return `Revanth specializes in data engineering with expertise in: ${kb.skills.dataEngineering.join(', ')}. He has built scalable data pipelines processing millions of events daily and implemented data lake architectures handling 50TB+ of data.`;
        }

        // Programming languages
        if (msg.includes('python') || msg.includes('programming') || msg.includes('languages')) {
            return `Revanth's programming expertise includes: ${kb.skills.programming.join(', ')}. He particularly excels in Python for data engineering and automation tasks.`;
        }

        // Projects
        if (msg.includes('project') || msg.includes('work') || msg.includes('portfolio')) {
            const projects = kb.projects.map(project => 
                `**${project.name}**: ${project.description}`
            ).join('\n\n');
            return `Here are some of Revanth's key projects:\n\n${projects}`;
        }

        return null;
    }

    getFallbackResponse(message) {
        const fallbacks = [
            "That's a great question! For detailed information about Revanth's experience and projects, I'd recommend checking out his portfolio or reaching out to him directly at eswarrevanth@gmail.com",
            "I'd love to help with more specific details! Feel free to browse through Revanth's projects and skills on this site, or contact him at eswarrevanth@gmail.com for a conversation.",
            "For the most comprehensive answer to your question, I'd suggest contacting Revanth directly at eswarrevanth@gmail.com or connecting with him on LinkedIn."
        ];
        
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    async getOpenAIResponse(message) {
        const config = window.chatbotConfig;
        const settings = config.getSettings();
        
        // Prepare conversation context (keep last 8 messages for better context)
        const contextMessages = [
            { role: 'system', content: settings.systemPrompt },
            ...this.conversationHistory.slice(-8),
            { role: 'user', content: message }
        ];

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.getApiKey()}`
                },
                body: JSON.stringify({
                    model: settings.model,
                    messages: contextMessages,
                    max_tokens: settings.maxTokens,
                    temperature: settings.temperature,
                    presence_penalty: 0.1,
                    frequency_penalty: 0.1
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(`OpenAI API Error: ${error.error?.message || response.statusText}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
            
        } catch (error) {
            console.error('OpenAI API Error:', error);
            throw error;
        }
    }

    addMessage(message, sender) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);

        const avatar = sender === 'bot' ? '<div class="message-avatar">R</div>' : '';
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        messageElement.innerHTML = `
            ${avatar}
            <div class="message-content">
                <div class="message-text">${this.formatMessage(message)}</div>
                <div class="message-time">${timestamp}</div>
            </div>
        `;

        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Add animation
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(10px)';
        requestAnimationFrame(() => {
            messageElement.style.transition = 'all 0.3s ease';
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateY(0)';
        });
    }

    formatMessage(text) {
        // Convert line breaks to HTML
        let message = text.replace(/\n/g, '<br>');
        
        // Make **text** bold
        message = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Convert URLs to links
        message = message.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
        
        // Convert email addresses to links
        message = message.replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '<a href="mailto:$1">$1</a>');
        
        return message;
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbot-messages');
        const typingElement = document.createElement('div');
        typingElement.classList.add('message', 'bot', 'typing');
        typingElement.id = 'typing-indicator';

        typingElement.innerHTML = `
            <div class="message-avatar">R</div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;

        messagesContainer.appendChild(typingElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        this.isTyping = true;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        this.isTyping = false;
    }

    // Enhanced functionality methods
    enableEnhancedMode() {
        this.isEnhanced = true;
        
        // Update UI to show enhanced mode
        const bubble = document.getElementById('chatbot-bubble');
        const bubbleContent = bubble.querySelector('.bubble-content');
        
        // Add enhanced indicator
        const indicator = document.createElement('div');
        indicator.className = 'chat-enhanced-indicator';
        indicator.textContent = '✨';
        bubble.appendChild(indicator);
        
        // Update bubble text
        bubbleContent.querySelector('.bubble-text').textContent = 'Ask me anything about Revanth!';
        
        console.log('✨ Enhanced chatbot mode activated with ChatGPT');
    }

    generateConversationId() {
        return 'conv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
    }


    // Override addMessage to add enhanced styling for GPT responses
    addMessage(message, sender) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);

        // Add enhanced class for GPT responses
        if (sender === 'bot' && this.isEnhanced) {
            messageElement.classList.add('enhanced-response');
        }

        const avatar = sender === 'bot' ? '<div class="message-avatar">R</div>' : '';
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        messageElement.innerHTML = `
            ${avatar}
            <div class="message-content">
                <div class="message-text">${this.formatMessage(message)}</div>
                <div class="message-time">${timestamp}</div>
            </div>
        `;

        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Add animation
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(10px)';
        requestAnimationFrame(() => {
            messageElement.style.transition = 'all 0.3s ease';
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateY(0)';
        });
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if not on a page that shouldn't have the chatbot
    window.portfolioChatbot = new PortfolioChatbot();
});
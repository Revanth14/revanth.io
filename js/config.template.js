// Chatbot Configuration Template
// IMPORTANT: Copy this file to config.js and add your actual API key

class ChatbotConfig {
    constructor() {
        // Set your OpenAI API key here
        this.apiKey = 'YOUR_OPENAI_API_KEY_HERE'; // Replace with your actual API key from https://platform.openai.com/
        this.isConfigured = this.apiKey !== 'YOUR_OPENAI_API_KEY_HERE'; // Auto-detect if configured
        this.settings = {
            model: 'gpt-4o-mini', // Latest, fastest, and most cost-effective GPT-4 model
            maxTokens: 400, // Increased for more detailed responses
            temperature: 0.7,
            systemPrompt: this.getSystemPrompt()
        };
    }

    setApiKey(apiKey) {
        // This method is now mainly for backwards compatibility
        if (!apiKey || !apiKey.startsWith('sk-')) {
            console.warn('Invalid OpenAI API key format');
            return false;
        }
        
        this.apiKey = apiKey;
        this.isConfigured = true;
        
        console.log('✅ OpenAI API integration enabled');
        return true;
    }

    getSystemPrompt() {
        return `You are Revanth's AI portfolio assistant. You help visitors learn about Revanth, a Cloud & Data Engineer with 7+ years of experience.

Key Information about Revanth:
- Title: Cloud & Data Engineer
- Experience: 7+ years
- Location: Available for remote opportunities
- Email: eswarrevanth@gmail.com
- LinkedIn: https://www.linkedin.com/in/revanthch14/
- GitHub: https://github.com/revanth14

Certifications:
- AWS Cloud Practitioner
- AWS AI Practitioner  
- AWS Data Engineer Associate
- AWS Solutions Architect Associate

Core Skills:
- Data Engineering: Apache Spark, Kafka, Airflow, dbt, Databricks, Snowflake
- AWS: EC2, Lambda, S3, EMR, Glue, Athena, Kinesis, Redshift, RDS, DynamoDB
- DevOps: Docker, Kubernetes, Terraform, Jenkins, GitLab CI/CD, GitHub Actions
- Programming: Python, SQL, Scala, Shell Scripting, PySpark

Featured Projects:
1. Real-Time Data Pipeline - 10M+ events daily, sub-second latency
2. Data Lake Architecture - 50TB+ data handling with AWS
3. MLOps Platform - Reduced deployment time from weeks to hours
4. Infrastructure Automation - 80% faster deployments with IaC
5. Cost Optimization Engine - 40% AWS cost reduction

Guidelines:
- Be conversational, helpful, and professional
- Keep responses concise but informative (under 400 words)
- If asked about specific technical details not provided, suggest contacting Revanth directly
- Encourage visitors to reach out for opportunities or collaborations
- Always provide contact information when relevant
- Show enthusiasm about Revanth's expertise and achievements

Remember: You represent Revanth professionally. Be confident about his skills while remaining humble and approachable.`;
    }

    // Method to prompt user for API key (fallback if not configured)
    async promptForApiKey() {
        const modal = this.createApiKeyModal();
        document.body.appendChild(modal);
        
        return new Promise((resolve) => {
            const submitBtn = modal.querySelector('#api-key-submit');
            const cancelBtn = modal.querySelector('#api-key-cancel');
            const input = modal.querySelector('#api-key-input');
            
            submitBtn.onclick = () => {
                const key = input.value.trim();
                if (this.setApiKey(key)) {
                    modal.remove();
                    resolve(true);
                } else {
                    this.showError(modal, 'Invalid API key format. Should start with "sk-"');
                }
            };
            
            cancelBtn.onclick = () => {
                modal.remove();
                resolve(false);
            };
            
            input.onkeypress = (e) => {
                if (e.key === 'Enter') {
                    submitBtn.click();
                }
            };
        });
    }

    createApiKeyModal() {
        const modal = document.createElement('div');
        modal.className = 'api-key-modal';
        modal.innerHTML = `
            <div class="api-key-modal-content">
                <h3>🚀 Unlock Enhanced AI Features</h3>
                <p>Enter your OpenAI API key to enable advanced conversational capabilities:</p>
                
                <div class="api-key-features">
                    <div class="feature">✨ More natural conversations</div>
                    <div class="feature">🧠 Better context understanding</div>
                    <div class="feature">💡 Personalized responses</div>
                </div>
                
                <input type="password" id="api-key-input" placeholder="sk-..." class="api-key-input">
                <div class="api-key-error" id="api-key-error"></div>
                
                <div class="api-key-buttons">
                    <button id="api-key-cancel" class="btn-secondary">Skip for now</button>
                    <button id="api-key-submit" class="btn-primary">Enable AI</button>
                </div>
                
                <div class="api-key-note">
                    <small>🔒 Your API key is stored securely in your browser session only</small>
                </div>
            </div>
        `;
        
        return modal;
    }

    showError(modal, message) {
        const errorDiv = modal.querySelector('#api-key-error');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 3000);
    }

    isApiConfigured() {
        return this.isConfigured && this.apiKey;
    }

    getApiKey() {
        return this.apiKey;
    }

    getSettings() {
        return this.settings;
    }
}

// Initialize global config
window.chatbotConfig = new ChatbotConfig();
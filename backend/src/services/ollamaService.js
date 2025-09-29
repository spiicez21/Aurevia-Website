import axios from 'axios';

class OllamaService {
  constructor() {
    this.baseURL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.model = process.env.OLLAMA_MODEL || 'gemma2:2b';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 300000, // 5 minutes timeout for long responses
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  /**
   * Check if Ollama service is running and model is available
   */
  async healthCheck() {
    try {
      const response = await this.client.get('/api/tags');
      const models = response.data.models || [];
      const modelExists = models.some(model => model.name === this.model);
      
      return {
        isRunning: true,
        modelAvailable: modelExists,
        availableModels: models.map(m => m.name)
      };
    } catch (error) {
      return {
        isRunning: false,
        modelAvailable: false,
        error: error.message
      };
    }
  }

  /**
   * Generate chat completion using Ollama
   */
  async generateCompletion(messages, options = {}) {
    try {
      const {
        model = this.model,
        temperature = 0.7,
        max_tokens = 1024,
        stream = false,
        system = 'You are a helpful AI assistant.'
      } = options;

      // Format messages for Ollama API
      const formattedMessages = this.formatMessages(messages, system);
      
      const requestData = {
        model,
        messages: formattedMessages,
        stream,
        options: {
          temperature,
          num_predict: max_tokens,
          top_p: 0.9,
          top_k: 40,
          repeat_penalty: 1.1
        }
      };

      const startTime = Date.now();
      const response = await this.client.post('/api/chat', requestData);
      const processingTime = Date.now() - startTime;

      if (stream) {
        return response; // Return raw response for streaming
      }

      const completion = response.data.message?.content || '';
      
      return {
        content: completion,
        model,
        usage: {
          prompt_tokens: this.estimateTokens(formattedMessages),
          completion_tokens: this.estimateTokens(completion),
          total_tokens: this.estimateTokens(formattedMessages) + this.estimateTokens(completion)
        },
        processingTime,
        metadata: {
          temperature,
          max_tokens,
          model
        }
      };
    } catch (error) {
      console.error('Ollama completion error:', error.response?.data || error.message);
      throw new Error(`Failed to generate completion: ${error.response?.data?.error || error.message}`);
    }
  }

  /**
   * Generate streaming completion
   */
  async *generateStreamingCompletion(messages, options = {}) {
    try {
      const {
        model = this.model,
        temperature = 0.7,
        max_tokens = 1024,
        system = 'You are a helpful AI assistant.'
      } = options;

      const formattedMessages = this.formatMessages(messages, system);
      
      const requestData = {
        model,
        messages: formattedMessages,
        stream: true,
        options: {
          temperature,
          num_predict: max_tokens,
          top_p: 0.9,
          top_k: 40,
          repeat_penalty: 1.1
        }
      };

      const response = await this.client.post('/api/chat', requestData, {
        responseType: 'stream'
      });

      let buffer = '';
      
      for await (const chunk of response.data) {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const data = JSON.parse(line);
              if (data.message?.content) {
                yield {
                  content: data.message.content,
                  done: data.done || false
                };
              }
              if (data.done) {
                return;
              }
            } catch (parseError) {
              console.error('Error parsing streaming response:', parseError);
            }
          }
        }
      }
    } catch (error) {
      console.error('Ollama streaming error:', error.response?.data || error.message);
      throw new Error(`Failed to generate streaming completion: ${error.response?.data?.error || error.message}`);
    }
  }

  /**
   * Format messages for Ollama API
   */
  formatMessages(messages, systemPrompt) {
    const formatted = [];
    
    // Add system message if provided
    if (systemPrompt) {
      formatted.push({
        role: 'system',
        content: systemPrompt
      });
    }

    // Add conversation messages
    messages.forEach(msg => {
      formatted.push({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      });
    });

    return formatted;
  }

  /**
   * Estimate token count (rough approximation)
   */
  estimateTokens(text) {
    if (typeof text === 'object') {
      text = JSON.stringify(text);
    }
    // Rough estimate: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  /**
   * Pull/download a model
   */
  async pullModel(modelName = this.model) {
    try {
      const response = await this.client.post('/api/pull', {
        name: modelName,
        stream: false
      });
      
      return {
        success: true,
        model: modelName,
        status: response.data.status
      };
    } catch (error) {
      console.error('Model pull error:', error.response?.data || error.message);
      throw new Error(`Failed to pull model ${modelName}: ${error.response?.data?.error || error.message}`);
    }
  }

  /**
   * List available models
   */
  async listModels() {
    try {
      const response = await this.client.get('/api/tags');
      return {
        models: response.data.models || [],
        count: response.data.models?.length || 0
      };
    } catch (error) {
      console.error('List models error:', error.response?.data || error.message);
      throw new Error(`Failed to list models: ${error.response?.data?.error || error.message}`);
    }
  }

  /**
   * Generate embeddings (if supported by model)
   */
  async generateEmbeddings(text, model = this.model) {
    try {
      const response = await this.client.post('/api/embeddings', {
        model,
        prompt: text
      });
      
      return {
        embeddings: response.data.embedding,
        model,
        dimensions: response.data.embedding?.length || 0
      };
    } catch (error) {
      console.error('Embeddings error:', error.response?.data || error.message);
      throw new Error(`Failed to generate embeddings: ${error.response?.data?.error || error.message}`);
    }
  }
}

// Create singleton instance
const ollamaService = new OllamaService();

export default ollamaService;
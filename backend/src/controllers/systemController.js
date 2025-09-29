import { ollamaService, databaseService } from '../services/index.js';
import { asyncHandler } from '../middleware/index.js';

/**
 * Health check endpoint
 */
export const healthCheck = asyncHandler(async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {}
  };

  // Check database connection
  try {
    const dbStatus = databaseService.getConnectionStatus();
    health.services.database = {
      status: dbStatus.state === 'connected' ? 'healthy' : 'unhealthy',
      ...dbStatus
    };
  } catch (error) {
    health.services.database = {
      status: 'unhealthy',
      error: error.message
    };
  }

  // Check Ollama service
  try {
    const ollamaHealth = await ollamaService.healthCheck();
    health.services.ollama = {
      status: ollamaHealth.isRunning && ollamaHealth.modelAvailable ? 'healthy' : 'unhealthy',
      ...ollamaHealth
    };
  } catch (error) {
    health.services.ollama = {
      status: 'unhealthy',
      error: error.message
    };
  }

  // Determine overall health
  const servicesHealthy = Object.values(health.services).every(
    service => service.status === 'healthy'
  );

  if (!servicesHealthy) {
    health.status = 'degraded';
  }

  const statusCode = health.status === 'healthy' ? 200 : 503;

  res.status(statusCode).json({
    success: health.status === 'healthy',
    data: health
  });
});

/**
 * Get available AI models
 */
export const getModels = asyncHandler(async (req, res) => {
  try {
    const models = await ollamaService.listModels();
    
    res.json({
      success: true,
      data: models
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Failed to fetch models',
      code: 'SERVICE_UNAVAILABLE',
      error: error.message
    });
  }
});

/**
 * Pull/download a model
 */
export const pullModel = asyncHandler(async (req, res) => {
  const { modelName } = req.body;

  if (!modelName) {
    return res.status(400).json({
      success: false,
      message: 'Model name is required',
      code: 'MISSING_MODEL_NAME'
    });
  }

  try {
    const result = await ollamaService.pullModel(modelName);
    
    res.json({
      success: true,
      message: `Model ${modelName} pulled successfully`,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to pull model ${modelName}`,
      code: 'MODEL_PULL_FAILED',
      error: error.message
    });
  }
});
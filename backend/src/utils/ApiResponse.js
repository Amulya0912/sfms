/**
 * Standardized API Response Builder
 * Ensures consistent response shape across all endpoints
 */
class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {*} data - Response payload
   * @param {string} message - Human-readable message
   */
  constructor(statusCode, data, message = 'Success') {
    this.success = statusCode < 400;
    this.code = statusCode;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  /**
   * Send success response
   */
  static success(res, data = null, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      code: statusCode,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Send created response (201)
   */
  static created(res, data = null, message = 'Created successfully') {
    return ApiResponse.success(res, data, message, 201);
  }

  /**
   * Send paginated response
   */
  static paginated(res, data, pagination, message = 'Success') {
    return res.status(200).json({
      success: true,
      code: 200,
      message,
      data,
      pagination,
      timestamp: new Date().toISOString(),
    });
  }
}

module.exports = ApiResponse;

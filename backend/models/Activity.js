const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: [
            'login',
            'logout',
            'signup',
            'password_change',
            'profile_update',
            'user_created',
            'user_deleted',
            'user_updated',
            'user_suspended',
            'role_changed',
            'order_placed',
            'order_cancelled',
            'order_completed',
            'product_created',
            'product_updated',
            'product_deleted',
            'settings_changed',
            'export_data',
            'import_data',
            'api_access'
        ]
    },
    description: {
        type: String,
        required: true
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    ipAddress: String,
    userAgent: String,
    severity: {
        type: String,
        enum: ['info', 'warning', 'error', 'critical'],
        default: 'info'
    },
    status: {
        type: String,
        enum: ['success', 'failed', 'pending'],
        default: 'success'
    }
}, {
    timestamps: true
});

// Index for efficient querying
ActivitySchema.index({ createdAt: -1 });
ActivitySchema.index({ user: 1, createdAt: -1 });
ActivitySchema.index({ action: 1, createdAt: -1 });

module.exports = mongoose.model('Activity', ActivitySchema);

const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null  // null means broadcast to all
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['info', 'success', 'warning', 'error', 'system'],
        default: 'info'
    },
    category: {
        type: String,
        enum: ['general', 'order', 'user', 'security', 'promotion', 'system'],
        default: 'general'
    },
    read: {
        type: Boolean,
        default: false
    },
    actionUrl: String,
    icon: String,
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    expiresAt: Date
}, {
    timestamps: true
});

NotificationSchema.index({ user: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Notification', NotificationSchema);

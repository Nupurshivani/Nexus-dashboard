const mongoose = require('mongoose');

const DailyAnalyticsSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        unique: true
    },
    users: {
        newSignups: { type: Number, default: 0 },
        activeUsers: { type: Number, default: 0 },
        totalUsers: { type: Number, default: 0 },
        returningUsers: { type: Number, default: 0 }
    },
    revenue: {
        total: { type: Number, default: 0 },
        orders: { type: Number, default: 0 },
        averageOrderValue: { type: Number, default: 0 },
        refunds: { type: Number, default: 0 }
    },
    traffic: {
        pageViews: { type: Number, default: 0 },
        uniqueVisitors: { type: Number, default: 0 },
        bounceRate: { type: Number, default: 0 },
        avgSessionDuration: { type: Number, default: 0 } // in seconds
    },
    conversions: {
        signups: { type: Number, default: 0 },
        purchases: { type: Number, default: 0 },
        downloads: { type: Number, default: 0 }
    },
    topPages: [{
        path: String,
        views: Number
    }],
    topCountries: [{
        country: String,
        visitors: Number
    }],
    deviceBreakdown: {
        desktop: { type: Number, default: 0 },
        mobile: { type: Number, default: 0 },
        tablet: { type: Number, default: 0 }
    },
    browserBreakdown: {
        chrome: { type: Number, default: 0 },
        firefox: { type: Number, default: 0 },
        safari: { type: Number, default: 0 },
        edge: { type: Number, default: 0 },
        other: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});

// Index for date queries
DailyAnalyticsSchema.index({ date: -1 });

module.exports = mongoose.model('DailyAnalytics', DailyAnalyticsSchema);

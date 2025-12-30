const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Order = require('./models/Order');
const Activity = require('./models/Activity');
const Notification = require('./models/Notification');
const DailyAnalytics = require('./models/Analytics');

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');

        // Clear existing data
        await User.deleteMany({});
        await Order.deleteMany({});
        await Activity.deleteMany({});
        await Notification.deleteMany({});
        await DailyAnalytics.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Create admin user
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@dashboard.com',
            password: 'admin123',
            role: 'superadmin',
            status: 'active',
            department: 'engineering',
            phone: '+91 98765 43210'
        });
        console.log('👤 Created admin user');

        // Create sample users
        const users = [];
        const departments = ['engineering', 'marketing', 'sales', 'support'];
        const statuses = ['active', 'inactive'];

        for (let i = 1; i <= 25; i++) {
            users.push(await User.create({
                name: `User ${i}`,
                email: `user${i}@example.com`,
                password: 'user123',
                role: 'user',
                department: departments[i % departments.length],
                status: statuses[i % 2],
                phone: `+91 ${9000000000 + i}`,
                createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
            }));
        }
        console.log(`👥 Created ${users.length} users`);

        // Create sample orders
        const orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        const orders = [];

        for (let i = 1; i <= 50; i++) {
            const user = users[Math.floor(Math.random() * users.length)];
            const status = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];

            orders.push(await Order.create({
                orderNumber: `ORD-${String(1000 + i).padStart(5, '0')}`,
                customer: {
                    name: user.name,
                    email: user.email,
                    phone: user.phone
                },
                items: [{
                    name: `Product ${i}`,
                    quantity: Math.floor(Math.random() * 5) + 1,
                    price: Math.floor(Math.random() * 1000) + 100,
                    total: Math.floor(Math.random() * 5000) + 500
                }],
                subtotal: Math.floor(Math.random() * 5000) + 500,
                tax: Math.floor(Math.random() * 500) + 50,
                discount: Math.floor(Math.random() * 200),
                total: Math.floor(Math.random() * 5000) + 500,
                status: status,
                paymentMethod: ['credit_card', 'debit_card', 'upi', 'netbanking', 'cod', 'wallet'][Math.floor(Math.random() * 6)],
                paymentStatus: status === 'delivered' ? 'completed' : status === 'cancelled' ? 'refunded' : 'pending',
                createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
            }));
        }
        console.log(`📦 Created ${orders.length} orders`);

        // Create analytics data
        for (let i = 7; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            await DailyAnalytics.create({
                date,
                users: {
                    newSignups: Math.floor(Math.random() * 20) + 5,
                    activeUsers: Math.floor(Math.random() * 100) + 50
                },
                revenue: {
                    total: Math.floor(Math.random() * 50000) + 10000,
                    orders: Math.floor(Math.random() * 30) + 10
                },
                traffic: {
                    pageViews: Math.floor(Math.random() * 1000) + 500,
                    uniqueVisitors: Math.floor(Math.random() * 500) + 200
                },
                conversions: {
                    signups: Math.floor(Math.random() * 10) + 2,
                    purchases: Math.floor(Math.random() * 20) + 5,
                    downloads: Math.floor(Math.random() * 30) + 10
                },
                deviceBreakdown: {
                    desktop: Math.floor(Math.random() * 30) + 50,
                    mobile: Math.floor(Math.random() * 30) + 20,
                    tablet: Math.floor(Math.random() * 10) + 5
                },
                browserBreakdown: {
                    chrome: Math.floor(Math.random() * 20) + 60,
                    safari: Math.floor(Math.random() * 15) + 15,
                    firefox: Math.floor(Math.random() * 10) + 10,
                    edge: Math.floor(Math.random() * 5) + 5,
                    other: Math.floor(Math.random() * 5) + 2
                }
            });
        }
        console.log('📊 Created analytics data');

        // Create some activities
        const actions = ['login', 'logout', 'user_created', 'user_updated', 'order_placed', 'order_completed'];
        for (let i = 0; i < 20; i++) {
            await Activity.create({
                user: users[Math.floor(Math.random() * users.length)]._id,
                action: actions[Math.floor(Math.random() * actions.length)],
                description: `Activity ${i + 1}`,
                severity: ['info', 'warning', 'error'][Math.floor(Math.random() * 3)],
                status: 'success',
                createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
            });
        }
        console.log('📝 Created activities');

        console.log('\n✅ Database seeded successfully!');
        console.log('\n📝 Login credentials:');
        console.log('   Email: admin@dashboard.com');
        console.log('   Password: admin123\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();

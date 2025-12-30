require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('./models/User');
const Order = require('./models/Order');
const Activity = require('./models/Activity');
const Notification = require('./models/Notification');
const DailyAnalytics = require('./models/Analytics');

// Seed data
const seedDatabase = async () => {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Order.deleteMany({});
        await Activity.deleteMany({});
        await Notification.deleteMany({});
        await DailyAnalytics.deleteMany({});

        // Create admin user
        console.log('👤 Creating admin user...');
        const admin = await User.create({
            name: 'Nupur Shivani',
            email: 'admin@dashboard.com',
            password: 'admin123',
            role: 'superadmin',
            status: 'active',
            department: 'engineering',
            phone: '+91 98765 43210',
            location: { city: 'Mumbai', country: 'India' },
            avatar: null,
            preferences: { theme: 'dark', notifications: true, language: 'en' }
        });
        console.log('✅ Admin created:', admin.email);

        // Create sample users
        console.log('👥 Creating sample users...');
        const departments = ['engineering', 'marketing', 'sales', 'support', 'hr', 'finance', 'operations'];
        const statuses = ['active', 'active', 'active', 'inactive', 'pending'];
        const roles = ['user', 'user', 'user', 'moderator', 'admin'];

        const sampleUsers = [
            { name: 'Rahul Sharma', email: 'rahul.sharma@example.com' },
            { name: 'Priya Patel', email: 'priya.patel@example.com' },
            { name: 'Amit Singh', email: 'amit.singh@example.com' },
            { name: 'Sneha Gupta', email: 'sneha.gupta@example.com' },
            { name: 'Vikram Reddy', email: 'vikram.reddy@example.com' },
            { name: 'Anjali Nair', email: 'anjali.nair@example.com' },
            { name: 'Arjun Kumar', email: 'arjun.kumar@example.com' },
            { name: 'Meera Joshi', email: 'meera.joshi@example.com' },
            { name: 'Karthik Iyer', email: 'karthik.iyer@example.com' },
            { name: 'Divya Menon', email: 'divya.menon@example.com' },
            { name: 'Ravi Verma', email: 'ravi.verma@example.com' },
            { name: 'Neha Kapoor', email: 'neha.kapoor@example.com' },
            { name: 'Suresh Babu', email: 'suresh.babu@example.com' },
            { name: 'Pooja Desai', email: 'pooja.desai@example.com' },
            { name: 'Manish Tiwari', email: 'manish.tiwari@example.com' },
            { name: 'Shreya Rao', email: 'shreya.rao@example.com' },
            { name: 'Deepak Pandey', email: 'deepak.pandey@example.com' },
            { name: 'Kavita Choudhary', email: 'kavita.choudhary@example.com' },
            { name: 'Rohit Malhotra', email: 'rohit.malhotra@example.com' },
            { name: 'Anita Saxena', email: 'anita.saxena@example.com' }
        ];

        const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'];

        for (let i = 0; i < sampleUsers.length; i++) {
            await User.create({
                name: sampleUsers[i].name,
                email: sampleUsers[i].email,
                password: 'user123', // Will be hashed by pre-save middleware
                role: roles[i % roles.length],
                status: statuses[i % statuses.length],
                department: departments[i % departments.length],
                location: { city: cities[i % cities.length], country: 'India' },
                createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
                lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
                loginCount: Math.floor(Math.random() * 50) + 1
            });
        }
        console.log('✅ Created 20 sample users');

        // Create sample orders
        console.log('📦 Creating sample orders...');
        const orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        const paymentMethods = ['credit_card', 'debit_card', 'upi', 'netbanking', 'cod'];
        const products = [
            { name: 'Premium Subscription', price: 999 },
            { name: 'Enterprise License', price: 4999 },
            { name: 'Starter Pack', price: 299 },
            { name: 'Professional Plan', price: 1999 },
            { name: 'Team Bundle', price: 2999 },
            { name: 'Annual Plan', price: 7999 },
            { name: 'Lifetime Access', price: 14999 }
        ];

        for (let i = 0; i < 50; i++) {
            const user = sampleUsers[Math.floor(Math.random() * sampleUsers.length)];
            const product = products[Math.floor(Math.random() * products.length)];
            const quantity = Math.floor(Math.random() * 3) + 1;
            const subtotal = product.price * quantity;
            const tax = subtotal * 0.18;
            const discount = Math.random() > 0.7 ? subtotal * 0.1 : 0;
            const total = subtotal + tax - discount;
            const status = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];

            await Order.create({
                orderNumber: `ORD-${String(i + 1).padStart(6, '0')}`,
                customer: {
                    name: user.name,
                    email: user.email,
                    phone: '+91 ' + Math.floor(Math.random() * 9000000000 + 1000000000)
                },
                items: [{
                    name: product.name,
                    quantity,
                    price: product.price,
                    total: product.price * quantity
                }],
                subtotal,
                tax,
                discount,
                total,
                status,
                paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
                paymentStatus: status === 'delivered' ? 'completed' : (status === 'cancelled' ? 'refunded' : 'completed'),
                shippingAddress: {
                    street: `${Math.floor(Math.random() * 999) + 1}, Block ${String.fromCharCode(65 + Math.floor(Math.random() * 8))}`,
                    city: cities[Math.floor(Math.random() * cities.length)],
                    state: 'Maharashtra',
                    country: 'India',
                    zipCode: String(Math.floor(Math.random() * 499999 + 100000))
                },
                createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000)
            });
        }
        console.log('✅ Created 50 sample orders');

        // Create sample activities
        console.log('📝 Creating sample activities...');
        const allUsers = await User.find();
        const actions = ['login', 'logout', 'profile_update', 'settings_changed'];

        for (let i = 0; i < 100; i++) {
            const user = allUsers[Math.floor(Math.random() * allUsers.length)];
            const action = actions[Math.floor(Math.random() * actions.length)];

            await Activity.create({
                user: user._id,
                action,
                description: `${user.name} performed ${action.replace('_', ' ')}`,
                severity: 'info',
                status: 'success',
                createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
            });
        }
        console.log('✅ Created 100 sample activities');

        // Create sample notifications
        console.log('🔔 Creating sample notifications...');
        const notificationTypes = ['info', 'success', 'warning', 'system'];
        const notifications = [
            { title: 'Welcome to Dashboard!', message: 'Your account has been set up successfully. Explore the features now.' },
            { title: 'New Feature Available', message: 'Check out our new analytics dashboard with advanced insights.' },
            { title: 'Security Update', message: 'We\'ve enhanced our security protocols for better protection.' },
            { title: 'Weekly Report Ready', message: 'Your weekly performance report is now available for download.' },
            { title: 'System Maintenance', message: 'Scheduled maintenance on Sunday 2 AM - 4 AM IST.' },
            { title: 'New User Registered', message: 'A new user has signed up and is awaiting approval.' },
            { title: 'Revenue Milestone!', message: 'Congratulations! Monthly revenue has exceeded ₹10 Lakhs.' },
            { title: 'Traffic Surge Detected', message: 'Website traffic increased by 150% in the last hour.' }
        ];

        for (const notif of notifications) {
            await Notification.create({
                user: admin._id,
                title: notif.title,
                message: notif.message,
                type: notificationTypes[Math.floor(Math.random() * notificationTypes.length)],
                category: 'general',
                read: Math.random() > 0.5,
                createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
            });
        }
        console.log('✅ Created 8 sample notifications');

        // Create daily analytics data
        console.log('📊 Creating analytics data...');
        for (let i = 30; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            await DailyAnalytics.create({
                date,
                users: {
                    newSignups: Math.floor(Math.random() * 30) + 5,
                    activeUsers: Math.floor(Math.random() * 100) + 50,
                    totalUsers: 20 + (30 - i) * 5,
                    returningUsers: Math.floor(Math.random() * 60) + 20
                },
                revenue: {
                    total: Math.floor(Math.random() * 100000) + 20000,
                    orders: Math.floor(Math.random() * 20) + 5,
                    averageOrderValue: Math.floor(Math.random() * 3000) + 1000,
                    refunds: Math.floor(Math.random() * 5000)
                },
                traffic: {
                    pageViews: Math.floor(Math.random() * 2000) + 500,
                    uniqueVisitors: Math.floor(Math.random() * 800) + 200,
                    bounceRate: Math.floor(Math.random() * 30) + 20,
                    avgSessionDuration: Math.floor(Math.random() * 300) + 120
                },
                conversions: {
                    signups: Math.floor(Math.random() * 30) + 5,
                    purchases: Math.floor(Math.random() * 15) + 3,
                    downloads: Math.floor(Math.random() * 50) + 10
                },
                deviceBreakdown: {
                    desktop: Math.floor(Math.random() * 20) + 50,
                    mobile: Math.floor(Math.random() * 20) + 30,
                    tablet: Math.floor(Math.random() * 10) + 5
                },
                browserBreakdown: {
                    chrome: Math.floor(Math.random() * 15) + 55,
                    safari: Math.floor(Math.random() * 10) + 15,
                    firefox: Math.floor(Math.random() * 8) + 8,
                    edge: Math.floor(Math.random() * 5) + 3,
                    other: Math.floor(Math.random() * 5) + 2
                }
            });
        }
        console.log('✅ Created 31 days of analytics data');

        console.log(`🎉 Database seeding completed successfully! 🎉
    `);

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed Error:', error);
        process.exit(1);
    }
};

seedDatabase();

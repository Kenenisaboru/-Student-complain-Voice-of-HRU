const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Category = require('../models/Category');

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Seed Admin User
        const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@haramaya.edu.et' });

        if (!existingAdmin) {
            await User.create({
                name: process.env.ADMIN_NAME || 'System Administrator',
                email: process.env.ADMIN_EMAIL || 'admin@haramaya.edu.et',
                password: process.env.ADMIN_PASSWORD || 'Admin@12345',
                role: 'admin',
                department: 'Computer Science',
                isActive: true
            });
            console.log('✅ Admin user created');
        } else {
            console.log('ℹ️  Admin user already exists');
        }

        // Seed a staff user
        const existingStaff = await User.findOne({ email: 'staff@haramaya.edu.et' });
        if (!existingStaff) {
            await User.create({
                name: 'Dr. Abebe Kebede',
                email: 'staff@haramaya.edu.et',
                password: 'Staff@12345',
                role: 'staff',
                department: 'Computer Science',
                isActive: true
            });
            console.log('✅ Staff user created');
        } else {
            console.log('ℹ️  Staff user already exists');
        }

        // Seed a student user
        const existingStudent = await User.findOne({ email: 'student@haramaya.edu.et' });
        if (!existingStudent) {
            await User.create({
                name: 'Haramaya university student',
                email: 'student@haramaya.edu.et',
                password: 'Student@12345',
                role: 'student',
                studentId: 'UGR/25634/14',
                department: 'Software Engineering',
                isActive: true
            });
            console.log('✅ Student user created');
        } else {
            console.log('ℹ️  Student user already exists');
        }

        // Seed Default Categories
        const defaultCategories = [
            {
                name: 'Academic Issues',
                description: 'Complaints related to courses, grading, academic policies, and curriculum.',
                icon: '📚',
                color: '#6366f1'
            },
            {
                name: 'Faculty & Teaching',
                description: 'Complaints about teaching quality, faculty behavior, and class management.',
                icon: '👨‍🏫',
                color: '#8b5cf6'
            },
            {
                name: 'Infrastructure & Facilities',
                description: 'Issues with classrooms, labs, equipment, internet, and campus facilities.',
                icon: '🏗️',
                color: '#ec4899'
            },
            {
                name: 'Library Services',
                description: 'Complaints about library resources, access, and services.',
                icon: '📖',
                color: '#14b8a6'
            },
            {
                name: 'IT Services',
                description: 'Technical issues with university IT systems, WiFi, and software.',
                icon: '💻',
                color: '#f59e0b'
            },
            {
                name: 'Administrative Services',
                description: 'Issues with registration, documentation, and administrative processes.',
                icon: '🏛️',
                color: '#ef4444'
            },
            {
                name: 'Student Services',
                description: 'Complaints about dining, dormitory, health services, and student support.',
                icon: '🎓',
                color: '#10b981'
            },
            {
                name: 'Safety & Security',
                description: 'Safety concerns, harassment, and security-related issues.',
                icon: '🛡️',
                color: '#f97316'
            },
            {
                name: 'Other',
                description: 'General complaints and suggestions that do not fit other categories.',
                icon: '📝',
                color: '#64748b'
            }
        ];

        for (const cat of defaultCategories) {
            const exists = await Category.findOne({ name: cat.name });
            if (!exists) {
                await Category.create(cat);
                console.log(`✅ Category "${cat.name}" created`);
            } else {
                console.log(`ℹ️  Category "${cat.name}" already exists`);
            }
        }

        console.log('\n🎉 Database seeding complete!');


        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedDatabase();

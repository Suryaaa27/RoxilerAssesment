const { User, sequelize } = require('./models');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    const adminEmail = 'admin@gmail.com';
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });

    if (existingAdmin) {
      console.log('Admin user already exists!');
      process.exit();
    }

    await User.create({
      name: 'System Administrator Account',
      email: adminEmail,
      password: 'admin1234@',
      address: 'Admin Headquarters',
      role: 'ADMIN'
    });

    console.log('Admin user created successfully!');
    console.log('Email: admin@gmail.com');
    console.log('Password: admin1234@');
    process.exit();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

seedAdmin();

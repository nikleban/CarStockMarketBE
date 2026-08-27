import sequelize from '#/config/db.js';
import User from '#/models/User.js';
import UserSetting from '#/models/UserSetting.js';

const seedUserSettings = async () => {
  try {
    await sequelize.authenticate();

    const users = await User.findAll({ attributes: ['id'] });

    const existingSettings = await UserSetting.findAll({ attributes: ['userId'] });
    const existingUserIds = new Set(existingSettings.map((s) => s.userId));

    const missing = users.filter((u) => !existingUserIds.has(u.id));

    if (missing.length === 0) {
      console.log('All users already have settings. Nothing to seed.');
      return;
    }

    await UserSetting.bulkCreate(
      missing.map((u) => ({ userId: u.id, language: 'en' })),
      { ignoreDuplicates: true }
    );

    console.log(`Seeded UserSettings for ${missing.length} existing user(s).`);
  } catch (error) {
    console.error('Failed to seed UserSettings:', error);
  } finally {
    await sequelize.close();
  }
};

seedUserSettings();

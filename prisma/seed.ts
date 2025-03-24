import prisma from './client';
import { seedAuthors } from './seeds/authors.seed';
import { seedBranches } from './seeds/branches.seed';
import { seedCategories } from './seeds/categories.seed';
import { seedClasses } from './seeds/classes.seed';
import { seedGenres } from './seeds/genres.seed';
import { seedInventoriesReceiptPublications } from './seeds/inventories-receipt-publications.seed';
import { seedInventories } from './seeds/inventories.seed';
import { seedInventoryReceipts } from './seeds/inventory-receipts.seed';
import { seedItemConditions } from './seeds/item-conditions.seed';
import { seedLanguages } from './seeds/languages.seed';
import { seedMemberGroups } from './seeds/member-groups.seed';
import { seedMembers } from './seeds/members.seed';
import { seedPermGroups } from './seeds/permission-groups.seed';
import { seedPerms } from './seeds/permissions.seed';
import { seedPublications } from './seeds/publications.seed';
import { seedPublishers } from './seeds/publishers.seed';
import { seedRoles } from './seeds/roles.seed';
import { seedSchoolYears } from './seeds/school-year.seed';
import { seedSettings } from './seeds/settings.seed';
import { seedAdminUser, seedUsers } from './seeds/users.seed';

async function main() {
  // Seed dữ liệu cho các bảng
  const rootBranch = await seedBranches('branches.csv');
  const perms = await seedPerms('permissions.csv');
  await seedPermGroups('permission-groups.csv');
  await seedGenres('genres.csv');
  await seedAuthors('authors.csv');
  await seedCategories('categories.csv');
  await seedLanguages('languages.csv');
  await seedPublishers('publishers.csv');
  const rootRole = await seedRoles('roles.csv', perms);
  await seedAdminUser(rootRole, rootBranch);
  await seedSettings('setting.csv');
  await seedUsers('users.csv');
  await seedPublications('publications.csv');
  await seedItemConditions('item-conditions.csv');
  await seedInventories('inventories.csv');
  await seedInventoryReceipts('inventory-receipts.csv');
  await seedInventoriesReceiptPublications(
    'inventories-receipt-publications.csv',
  );
  await seedClasses('classes.csv');
  await seedSchoolYears('school-years.csv');
  await seedMemberGroups('member-groups.csv');
  await seedMembers('members.csv');
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.log(err);
    await prisma.$disconnect();
    process.exit(1);
  });

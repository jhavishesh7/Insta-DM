import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function resetVerification() {
  const igUserId = '916687624591193'; // This matches the senderId in logs
  
  console.log(`🧹 Resetting verification for user: ${igUserId}...`);
  
  try {
    const res = await prisma.userWorkflowState.update({
      where: { igUserId },
      data: { isFollowerVerified: false, flowState: 'IDLE' }
    });
    console.log('✅ Update successful:', res);
  } catch (err) {
    console.log('❌ Update failed (User might not exist in this table yet):', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetVerification();

import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const password = await bcrypt.hash('Admin1234***', 10)

    // Remove old admin
    const deleted = await prisma.user.deleteMany({
        where: { email: 'admin@palaciomotors.com' }
    })
    if (deleted.count > 0) {
        console.log('Deleted old admin user')
    }

    // Create/Update seed users
    const user1 = await prisma.user.upsert({
        where: { email: 'pruebas01@yopmail.com' },
        update: { password },
        create: {
            email: 'pruebas01@yopmail.com',
            fullName: 'Pruebas 01',
            password,
            role: 'ADMIN',
            phone: '1111111111'
        },
    })
    console.log({ user1 })

    const user2 = await prisma.user.upsert({
        where: { email: 'pruebas02@yopmail.com' },
        update: { password },
        create: {
            email: 'pruebas02@yopmail.com',
            fullName: 'Pruebas 02',
            password,
            role: 'USER',
            phone: '2222222222'
        },
    })
    console.log({ user2 })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

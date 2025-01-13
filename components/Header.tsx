import { auth } from '@/auth';
import { prisma } from "@/lib/prisma";
import ClientHeader from './ClientHeader';

export default async function Header() {
    const session = await auth();
    const userId = session?.user?.id;
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { image: true, email: true },
    });
    
    const imageUrl = user?.image ?? undefined;
    const email = user?.email;

    return <ClientHeader imageUrl={imageUrl} email={email} />;
}
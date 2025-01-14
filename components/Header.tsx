import { auth } from '@/auth';
import { prisma } from "@/lib/prisma";
import ClientHeader from './ClientHeader';
import { redirect } from 'next/navigation';

export default async function Header() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        redirect('/login');
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { image: true, email: true },
    });
    
    const imageUrl = user?.image ?? undefined;
    const email = user?.email;

    return <ClientHeader imageUrl={imageUrl} email={email} />;
}

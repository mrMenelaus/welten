import { AdminPanel } from "@/components/admin/admin-panel";
import { UnderDevelopment } from "@/components/layout/under-development";
import { getSession } from "@/lib/auth/get-session";
import { prisma } from "@/lib/prisma";

export default async function Admin(){
    const session = await getSession()
    if (!session?.roles.includes(process.env.ADMIN_ROLE!)) return <UnderDevelopment />

    const donates = await prisma.donate.findMany({orderBy: {createdAt: "desc"}})

    return <AdminPanel donates={donates}/>
}
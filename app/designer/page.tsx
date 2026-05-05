import { UnderDevelopment } from "@/components/layout/under-development";
import { getSession } from "@/lib/auth/get-session";
// import { prisma } from "@/lib/prisma";


const designer = process.env.DESIGNER_ROLE!

export default async function DesignerPage(){
    // const players = await prisma.player.findMany()

    const session = await getSession()
    
    
    if (session?.roles.includes(designer)) {
        return <div>
            Welcome to the club, buddy
        </div>
    }

    return <UnderDevelopment />

}
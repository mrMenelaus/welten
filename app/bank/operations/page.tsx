// import { UnderDevelopment } from "@/components/layout/under-development";
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { getSession } from "@/lib/auth/get-session";
// import { prisma } from "@/lib/prisma";

import { UnderDevelopment } from "@/components/layout/under-development";

export default function Page(){
    return <UnderDevelopment />
}

// export default async function Operations({searchParams}: PageProps<"/bank/operations">) {
//   const session = await getSession();
//   if (!session) {
//     return <UnderDevelopment />;
//   }

//   const page = Number(
//       (await searchParams).page
//   )


//   const limit = 10

//   const transfers = await prisma.transfer.findMany({
//     where: { OR: [{ targetId: session.sub }, { sourceId: session.sub }] },
//     orderBy: { time: "desc" },
//   });

//   const count = await prisma.transfer.count({
//     where: { OR: [{ targetId: session.sub }, { sourceId: session.sub }] },
//   });

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle></CardTitle>
//       </CardHeader>
//       <CardContent>
        
//       </CardContent>
//       <CardFooter></CardFooter>
//     </Card>
//   );
// }
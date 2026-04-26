import { ProfileCard } from "@/components/profile/profile-card"

export default async function Player({params}: PageProps<"/player/[name]">){
    const {name} = await params

    return <ProfileCard name={name} />    
}
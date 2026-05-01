"use client"

import Image from "next/image"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { ImageIcon } from "lucide-react"

export function FullscreenView({alt,src}: {src: string, alt: string}){
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="icon-sm"><ImageIcon/></Button>
      </DialogTrigger>
      <DialogContent className="md:min-w-2xl min-w-2xs">
        <DialogHeader>
          <DialogTitle>Изображение</DialogTitle>
          <DialogDescription>
            Рассмотрите все детали картинки
          </DialogDescription>
        </DialogHeader>
        <div className="aspect-square relative">
            <Image fill src={src} alt={alt} className="object-contain"/>
        </div>
      </DialogContent>
    </Dialog>
  )
}
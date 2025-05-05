"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { createGame, updateGame } from "@/services/admin/gamesService"
import type { Game } from "@/types/types"

// Schema for game form validation
const gameFormSchema = z.object({
  title: z.string().min(2, {
    message: "O título deve ter pelo menos 2 caracteres.",
  }),
  imageUrl: z.string().url({
    message: "Por favor, insira uma URL válida para a imagem.",
  }),
  developer: z.string().min(2, {
    message: "O desenvolvedor deve ter pelo menos 2 caracteres.",
  }),
})

type GameFormValues = z.infer<typeof gameFormSchema>

interface GameFormProps {
  game?: Game
  isEditing?: boolean
}

export function GameForm({ game, isEditing = false }: GameFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form with default values or existing game data
  const form = useForm<GameFormValues>({
    resolver: zodResolver(gameFormSchema),
    defaultValues: {
      title: game?.title || "",
      imageUrl: game?.imageUrl || "",
      developer: game?.developer || "",
    },
  })

  async function onSubmit(values: GameFormValues) {
    setIsSubmitting(true)
    try {
      if (isEditing && game) {
        await updateGame(game.id, values)
      } else {
        await createGame(values)
      }
      router.push("/admin/games")
      router.refresh()
    } catch (error) {
      console.error("Error saving game:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o título do jogo" {...field} />
                  </FormControl>
                  <FormDescription>O título completo do jogo.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da Imagem</FormLabel>
                  <FormControl>
                    <Input placeholder="https://exemplo.com/imagem.jpg" {...field} />
                  </FormControl>
                  <FormDescription>URL da imagem de capa do jogo.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="developer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desenvolvedor</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome do desenvolvedor" {...field} />
                  </FormControl>
                  <FormDescription>O estúdio ou empresa que desenvolveu o jogo.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : isEditing ? "Atualizar Jogo" : "Criar Jogo"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

'use client'

import { Button } from '@nathy/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@nathy/shared/ui/card'
import { Activity, Calendar, Trophy, Users } from 'lucide-react'
import { motion } from 'motion/react'

export function DashboardWidgets() {
  return (
    <div className="grid gap-6 p-6 lg:grid-cols-3">
        {/* Resumo rápido */}
        <motion.div
          className='grid grid-cols-2 gap-4 md:grid-cols-4 lg:col-span-3'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className='flex flex-col items-center justify-center p-4'>
            <Trophy className="h-6 w-6 text-yellow-500" />
            <p className='mt-2 text-sm'>Listas criadas</p>
            <span className='font-bold text-xl'>12</span>
          </Card>
          <Card className='flex flex-col items-center justify-center p-4'>
            <Users className="h-6 w-6 text-blue-500" />
            <p className='mt-2 text-sm'>Jogadores</p>
            <span className='font-bold text-xl'>34</span>
          </Card>
          <Card className='flex flex-col items-center justify-center p-4'>
            <Calendar className="h-6 w-6 text-green-500" />
            <p className='mt-2 text-sm'>Partidas</p>
            <span className='font-bold text-xl'>87</span>
          </Card>
          <Card className='flex flex-col items-center justify-center p-4'>
            <Activity className="h-6 w-6 text-red-500" />
            <p className='mt-2 text-sm'>Vitórias</p>
            <span className='font-bold text-xl'>56</span>
          </Card>
        </motion.div>

        {/* Próximas partidas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>📅 Próximas partidas</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex justify-between border-b pb-2">
                <span>Felipe vs Nicolle</span>
                <span className='text-muted-foreground text-sm'>25/08</span>
              </li>
              <li className="flex justify-between border-b pb-2">
                <span>João vs Maria</span>
                <span className='text-muted-foreground text-sm'>27/08</span>
              </li>
            </ul>
            <Button className="mt-4 w-full">Agendar nova partida</Button>
          </CardContent>
        </Card>

        {/* Ranking rápido */}
        <Card>
          <CardHeader>
            <CardTitle>🏆 Ranking</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2">
              <li className="flex justify-between font-medium">
                <span>🥇 Nicolle</span> <span>120 pts</span>
              </li>
              <li className="flex justify-between">
                <span>🥈 Felipe</span> <span>110 pts</span>
              </li>
              <li className="flex justify-between">
                <span>🥉 João</span> <span>95 pts</span>
              </li>
            </ol>
            <Button className="mt-4 w-full" variant="outline">
              Ver todos
            </Button>
          </CardContent>
        </Card>

        {/* Últimos resultados */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>📊 Últimos resultados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='flex justify-between rounded-xl border p-3'>
                <span>Felipe 3 x 1 Nicolle</span>
                <span className='text-green-600 text-sm'>Finalizado</span>
              </div>
              <div className='flex justify-between rounded-xl border p-3'>
                <span>Maria 2 x 2 João</span>
                <span className="text-sm text-yellow-600">Empate</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  )
}
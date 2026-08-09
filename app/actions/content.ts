'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { isAdminUser } from '@/lib/auth'

export async function getContent(id: string) {
  try {
    const content = await prisma.pageContent.findUnique({
      where: { id }
    })
    return content?.content || null
  } catch (error) {
    console.error('Error fetching content:', error)
    return null
  }
}

export async function getAllContent() {
  try {
    const allContent = await prisma.pageContent.findMany()
    const contentMap = allContent.reduce((acc, curr) => {
      acc[curr.id] = curr.content
      return acc
    }, {} as Record<string, string>)
    return contentMap
  } catch (error) {
    console.error('Error fetching all content:', error)
    return {}
  }
}

export async function updateContent(id: string, content: string) {
  const isAdmin = await isAdminUser();
  if (!isAdmin) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.pageContent.upsert({
      where: { id },
      update: { content },
      create: { id, content }
    })
    
    // Revalidate the current page so changes appear immediately
    revalidatePath('/')
    
    return { success: true }
  } catch (error) {
    console.error('Error updating content:', error)
    return { success: false, error: 'Failed to update content' }
  }
}

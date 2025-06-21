// Atualização da função updateUserVotes para suportar a estrutura de votos por ano

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  type Firestore,
  type DocumentSnapshot,
  type DocumentData,
  collection,
  addDoc,
} from "firebase/firestore"
import { initializeApp } from "firebase/app"
import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence, type Auth } from "firebase/auth"
import type { StoryEntry } from "@/application/entities/User"
import type { DonationMeta } from "@/types/types"

export interface Round {
  dice_1: number
  dice_2: number
  dice_3: number
  choosed_value: number
  time: number
  success: boolean
  errors: number
  createdAt: Date
}

interface MatchHistoryEntry {
  id: number
  date: Date
  score: number
  errors: number
  duration: string
  rounds: Round[]
}

interface BestScoreData {
  value: number
  updatedAt: Date
}

interface CurrencyData {
  value: number
  updatedAt: Date
}

interface BestScore {
  value: number
  updatedAt: Date
}

interface Credit {
  value: number
  updatedAt: Date
}

interface Currency {
  value: number
  updatedAt: Date
}

interface FirestoreUser {
  id: string
  displayName: string
  email: string
  best_score?: BestScore
  currency?: Currency
}

interface LeaderboardEntry {
  id: string
  name: string
  score: number
  date: Date
}

interface LeaderboardPayload {
  id: string
  name: string
  owner: string
  description: string
  leaderboard: LeaderboardEntry[]
  date: string
  type: string
}

interface TotalGamesData {
  value: number
  updatedAt: Date
}

// Atualização da interface Votes para suportar a estrutura por ano
interface Votes {
  [year: string]: {
    [category: string]: string
  }
}

interface UserData {
  displayName: string
  best_score: BestScoreData
  credits: Credit
  currency: CurrencyData
  total_games: TotalGamesData
  email: string
  story?: StoryEntry[]
  match_history?: MatchHistoryEntry[]
  photoURL: string
  votes?: Votes
  role?: string
}

interface VotesData {
  userId: string
  votes: Votes
  timestamp: Date
}

let globalUser: UserData | null = null

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
}

function initFirebase() {
  const config = firebaseConfig

  const app = initializeApp(config)
  const authFirestore = getAuth(app)
  const dbFirestore = getFirestore(app)

  return { authFirestore, dbFirestore }
}

const { dbFirestore, authFirestore } = initFirebase()

async function initUserFirebase(authFirestore: Auth, dbFirestore: Firestore) {
  await setPersistence(authFirestore, browserLocalPersistence)

  onAuthStateChanged(authFirestore, async (user) => {
    if (user) {
      globalUser = await fetchUserData(dbFirestore, user.email!)
      if (globalUser) {
        localStorage.setItem("user", JSON.stringify(globalUser))
        displayUserInfo(globalUser)
      } else {
        console.error("User not found in 'users' collection.")
      }
    }
  })

  return { authFirestore, dbFirestore }
}

async function fetchUserData(db: Firestore, email: string): Promise<UserData | null> {
  try {
    const userRef = doc(db, process.env.NEXT_PUBLIC_USERS_COLLECTION!, email)
    const docSnap: DocumentSnapshot<DocumentData> = await getDoc(userRef)

    if (docSnap.exists()) {
      return docSnap.data() as UserData
    }
    return null
  } catch (error) {
    console.error("Error fetching user data:", error)
    return null
  }
}

// Função atualizada para suportar a estrutura de votos por ano
async function updateUserVotes(email: string, votes: Votes, db: Firestore): Promise<void> {
  const userRef = doc(db, process.env.NEXT_PUBLIC_USERS_COLLECTION!, email)

  try {
    const userSnap = await getDoc(userRef)

    // Atualiza apenas o campo votes
    await setDoc(
      userRef,
      {
        votes: votes,
        lastUpdated: new Date().toISOString(),
      },
      { merge: true },
    )

    console.log("User votes updated successfully.")
  } catch (error) {
    console.error("Error updating user votes:", error)
    throw error
  }
}

function displayUserInfo(user: UserData): void {
  console.log(
    `User: ${user.displayName}, Best Score: ${user.best_score?.value}, Currency: ${user.currency?.value}, Total Games: ${user.total_games?.value}, Photo URL: ${user.photoURL}`,
  )
}


async function updateStory(email: string, story: StoryEntry[], db: Firestore): Promise<void> {
  const userRef = doc(db, process.env.NEXT_PUBLIC_USERS_COLLECTION!, email)

  try {
    await updateDoc(userRef, {
      story: story,
      lastUpdated: new Date().toISOString(),
    })
    console.log("User story updated successfully.")
  } catch (error) {
    console.error("Error updating user story:", error)
    throw error
  }
}

async function updateUserBestScore(email: string, best_score: BestScoreData, db: Firestore): Promise<void> {
  const userRef = doc(db, process.env.NEXT_PUBLIC_USERS_COLLECTION!, email)

  try {
    await updateDoc(userRef, {
      best_score: best_score,
      lastUpdated: new Date().toISOString(),
    })
    console.log("User best score updated successfully.")
  } catch (error) {
    console.error("Error updating user best score:", error)
    throw error
  }
}

async function updateUserCredits(email: string, credits: Credit, db: Firestore): Promise<void> {
  const userRef = doc(db, process.env.NEXT_PUBLIC_USERS_COLLECTION!, email)

  try {
    await updateDoc(userRef, {
      credits: credits,
      lastUpdated: new Date().toISOString(),
    })
    console.log("User credits updated successfully.")
  } catch (error) {
    console.error("Error updating user credits:", error)
    throw error
  }
}

async function updateUserCurrency(email: string, currency: CurrencyData, db: Firestore): Promise<void> {
  const userRef = doc(db, process.env.NEXT_PUBLIC_USERS_COLLECTION!, email)

  try {
    await updateDoc(userRef, {
      currency: currency,
      lastUpdated: new Date().toISOString(),
    })
    console.log("User currency updated successfully.")
  } catch (error) {
    console.error("Error updating user currency:", error)
    throw error
  }
}

async function updateMatchHistory(email: string, match_history: MatchHistoryEntry[], db: Firestore): Promise<void> {
  const userRef = doc(db, process.env.NEXT_PUBLIC_USERS_COLLECTION!, email)

  try {
    await updateDoc(userRef, {
      match_history: match_history,
      lastUpdated: new Date().toISOString(),
    })
    console.log("User match history updated successfully.")
  } catch (error) {
    console.error("Error updating user match history:", error)
    throw error
  }
}

async function updateUserTotalGames(email: string, total_games: TotalGamesData, db: Firestore): Promise<void> {
  const userRef = doc(db, process.env.NEXT_PUBLIC_USERS_COLLECTION!, email)

  try {
    await updateDoc(userRef, {
      total_games: total_games,
      lastUpdated: new Date().toISOString(),
    })
    console.log("User total games updated successfully.")
  } catch (error) {
    console.error("Error updating user total games:", error)
    throw error
  }
}

// Funções para doação
async function fetchDonationMeta(db: Firestore): Promise<DonationMeta> {
  const docRef = doc(db, 'donations', 'meta')
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) {
    // Se não existir, cria com valores padrão
    const defaultMeta: DonationMeta = {
      edition: '2025',
      totalRaised: 0,
      startDate: new Date().toISOString(),
      endDate: new Date('2025-12-31').toISOString(),
      donationUrl: 'https://apoia.se/appjogodoano',
      isRevealed: false
    }

    await setDoc(docRef, defaultMeta)
    return defaultMeta
  }

  return docSnap.data() as DonationMeta
}

export {
  authFirestore,
  dbFirestore,
  displayUserInfo,
  fetchUserData,
  initFirebase,
  initUserFirebase,
  updateUserVotes,
  updateStory,
  updateUserBestScore,
  updateUserCredits,
  updateUserCurrency,
  updateMatchHistory,
  updateUserTotalGames,
  fetchDonationMeta,
}

export type { UserData, MatchHistoryEntry, Votes }

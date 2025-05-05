/**
 * Type definition for edition statistics
 */
export interface EditionStatsType {
  // Summary statistics
  totalVotes: number
  uniqueVoters: number
  votesChange: number
  votersChange: number
  topCategory: string
  topCategoryVotes: number
  topGame: string
  topGameVotes: number

  // Chart data
  votesOverTime: Array<{
    date: string
    votes: number
  }>

  categoryVotes: Array<{
    name: string
    value: number
  }>

  topGames: Array<{
    name: string
    votes: number
  }>

  votingTrends: Array<{
    date: string
    [key: string]: string | number
  }>
}

import { Card, CardContent, Typography, Avatar, Box } from '@mui/material'

interface LeaderboardEntry {
  id: number
  name: string
  jobTitle: string
  metric1: string
  metric2: string
  rank: string
  image: string
  backgroundColor: string
}

const leaderboardData: LeaderboardEntry[] = [
  {
    id: 1,
    name: 'NAME HERE',
    jobTitle: 'Job Title Here',
    metric1: 'Metric 1',
    metric2: 'Metric 2',
    rank: '001',
    image: '',
    backgroundColor: '#3474e6'
  },
  {
    id: 2,
    name: 'NAME HERE',
    jobTitle: 'Job Title Here',
    metric1: 'Metric 1',
    metric2: 'Metric 2',
    rank: '002',
    image: '',
    backgroundColor: '#00a1a1'
  },
  {
    id: 3,
    name: 'NAME HERE',
    jobTitle: 'Job Title Here',
    metric1: 'Metric 1',
    metric2: 'Metric 2',
    rank: '003',
    image: '',
    backgroundColor: '#2ecc71'
  }
]

const Leaderboard = () => {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3, mt: 5 }}>
      <Typography variant="h2" component="h1" align="center" gutterBottom sx={{ fontWeight: 700 }}>
        LEADERBOARD
      </Typography>
      <Typography variant="subtitle1" align="center" sx={{ mb: 4 }}>
        This is a free editable leaderboard design template from EDIT.org to customize online
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 100px',
          bgcolor: 'black',
          color: 'white',
          p: 2,
          mb: 1,
          borderRadius: '4px 4px 0 0'
        }}
      >
        <Typography variant="subtitle1">NAME</Typography>
        <Typography variant="subtitle1">METRIC</Typography>
        <Typography variant="subtitle1">RANK</Typography>
      </Box>

      {leaderboardData.map((entry) => (
        <Card
          key={entry.id}
          sx={{
            mb: 1,
            bgcolor: entry.backgroundColor,
            color: 'white',
            '&:hover': {
              opacity: 0.9
            }
          }}
        >
          <CardContent sx={{ p: '16px !important' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={entry.image}
                  sx={{ width: 56, height: 56 }}
                />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {entry.name}
                  </Typography>
                  <Typography variant="body2">
                    {entry.jobTitle}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="body1">
                  {entry.metric1}
                </Typography>
                <Typography variant="body1">
                  {entry.metric2}
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {entry.rank}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}

export default Leaderboard

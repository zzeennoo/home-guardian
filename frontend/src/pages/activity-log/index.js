// ** MUI Imports

import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'

// ** Demo Components Imports
import ActLogTable from 'src/pages/activity-log/ActLogTable'

const ActLog = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
          <Link href='https://mui.com/components/tables/' target='_blank'>
            Activity Log
          </Link>
        </Typography>
      </Grid>
      <Grid item xs={16}>
        <Card>
          <ActLogTable />
        </Card>
      </Grid>
    </Grid>
  )
}

export default ActLog

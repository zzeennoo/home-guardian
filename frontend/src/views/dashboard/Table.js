// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'

const rows = [
  {
    time : '10:00 AM',
    status: 'accepted',
    date: '09/27/2018',
    location: 'Door 1',
  },
  {
    date: '09/23/2016',
    time : '10:30 AM',
    status: 'error',
    location: 'Door 2',
  },
  {
    date: '10/15/2017',
    location: 'Door 1',
    status: 'rejected',
    time : '11:00 AM',
  },
  {
    date: '06/12/2018',
    status: 'accepted',
    time : '11:30 AM',
    location: 'Door 2',
  },
  {
    status: 'error',
    date: '03/24/2018',
    time : '12:00 PM',
    location: 'Door 2',
  },
  {
    date: '08/25/2017',
    time : '12:30 PM',
    location: 'Door 1',
    status: 'accepted',
  },
  {
    status: 'rejected',
    date: '06/01/2017',
    time : '01:00 PM',
    location: 'Door 1',
  },
  {
    time : '10:00 AM',
    date: '12/03/2017',
    location: 'Door 1',
    status: 'rejected',
  }
]

const statusObj = {
  accepted: { color: 'success' },
  error: { color: 'warning' },
  applied: { color: 'info' },
  rejected: { color: 'error' },
  current: { color: 'primary' },
  resigned: { color: 'warning' },
  professional: { color: 'success' }
}

const DashboardTable = () => {
  return (
    <Card>
      <TableContainer>
        <Table sx={{ minWidth: 800 }} aria-label='table with dividing lines'>
          <TableHead>
            <TableRow>
              <TableCell>Location</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                hover
                key={row.location}
                sx={{
                  '&:not(:last-of-type)': {
                    borderBottom: '1px solid #ddd', // Line between rows
                  },
                }}
              >
                <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{row.location}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.time}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    color={statusObj[row.status].color}
                    sx={{
                      height: 24,
                      fontSize: '0.75rem',
                      textTransform: 'capitalize',
                      '& .MuiChip-label': { fontWeight: 500 },
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}

export default DashboardTable

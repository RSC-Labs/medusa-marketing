/*
 * Copyright 2024 RSC-Labs, https://rsoftcon.com/
 *
 * MIT License
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Container, Heading, Table, Badge, Text, Tooltip, Alert } from "@medusajs/ui"
import { useMemo, useState } from "react"
import { EmailSent, EmailSentStatus, EmailSentType } from "../../types/models"
import { CircularProgress, Grid } from "@mui/material"
import { useAdminCustomQuery } from "medusa-react"
import { AdminMarketingEmailsSentGetReq, AdminMarketingEmailsSentResponse } from "../../types/api"
import { InformationCircle } from "@medusajs/icons"

const StatusBadge = ({status} : {status: EmailSentStatus}) => {
  switch (status) {
    case EmailSentStatus.PROCESSED:
      return <Badge color="green" size="xsmall">Processed</Badge>
    case EmailSentStatus.FAILED:
      return <Badge color="red" size="xsmall">Failed</Badge>
    default:
      return <Badge color='grey' size="xsmall">Unknown</Badge>
  }
}

const TypeBadge = ({type} : {type: EmailSentType}) => {
  switch (type) {
    case EmailSentType.WELCOME:
    case EmailSentType.BACK_IN_STOCK:
      return <Badge color="grey" size="xsmall" rounded='full'>{type.toString()}</Badge>
    default:
      return <Badge color='grey' size="xsmall" rounded='full'>Unknown</Badge>
  }
}

const EmailsSentTable= ({data} : {data: EmailSent[]}) => {
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 3
  const pageCount = Math.ceil(data.length / pageSize)
  const canNextPage = useMemo(
    () => currentPage < pageCount - 1,
    [currentPage, pageCount]
  )
  const canPreviousPage = useMemo(() => currentPage - 1 >= 0, [currentPage])

  const nextPage = () => {
    if (canNextPage) {
      setCurrentPage(currentPage + 1)
    }
  }

  const previousPage = () => {
    if (canPreviousPage) {
      setCurrentPage(currentPage - 1)
    }
  }

  const currentEmails = useMemo(() => {
    const offset = currentPage * pageSize
    const limit = Math.min(offset + pageSize, data.length)

    return data.slice(offset, limit)
  }, [currentPage, pageSize, data])

  return (
    <Container>
      <Grid container direction={'column'} rowSpacing={2}>
        <Grid item>
          <Heading>Recent activity</Heading>
        </Grid>
        <Grid item>
          <div className="flex gap-1 flex-col">
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Sent</Table.HeaderCell>
                  <Table.HeaderCell>Customer</Table.HeaderCell>
                  <Table.HeaderCell>Type</Table.HeaderCell>
                  <Table.HeaderCell className="text-right">
                    <Grid container justifyContent="flex-end" alignItems="flex-end" spacing={1}>
                      <Grid item>
                         Status
                      </Grid>
                      <Grid item>
                        <Tooltip content={
                          <Grid item>
                            <Text size="small">
                              PROCESSED means it has been processed succesfully and sent to email transport. However, we are not responsible if email transport is configured properly and email has been delivered.
                              FAILED means it did not reach email transport, so some error happened on plugin side. It can be a reason of wrong configuration or a bug.
                            </Text>
                          </Grid>
                        }>
                          <InformationCircle />
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {currentEmails.map((email) => {
                  return (
                    <Table.Row
                      key={email.id}
                    >
                      <Table.Cell>
                        <Tooltip content={email.created_at.toLocaleString()}>
                          <Text size="small">{new Date(email.created_at).toLocaleDateString()}</Text>
                        </Tooltip>
                      </Table.Cell>
                      <Table.Cell style={ { overflow: 'clip' }}>
                        <Text size="small">{email.receiver_email}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <TypeBadge type={email.type}/>
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        <StatusBadge status={email.status}/>
                      </Table.Cell>
                    </Table.Row>
                  )
                })}
              </Table.Body>
            </Table>
            <Table.Pagination
              count={data.length}
              pageSize={pageSize}
              pageIndex={currentPage}
              pageCount={data.length}
              canPreviousPage={canPreviousPage}
              canNextPage={canNextPage}
              previousPage={previousPage}
              nextPage={nextPage}
            />
          </div>
        </Grid>
      </Grid>
      
    </Container>
  )
}



export const EmailsSent = () => {
  const { data, isLoading } = useAdminCustomQuery
    <AdminMarketingEmailsSentGetReq, AdminMarketingEmailsSentResponse>(
      "/marketing/emails-sent",
      [''],
      {
      }
  )

  if (isLoading) {
    return (
      <CircularProgress size={10}/>
    )
  }

  if (data && data.result) {
    return <EmailsSentTable data={data.result}/>
  }
  return (
    <Alert variant="error">Cannot load emails</Alert>
  )
}
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

import { useEffect, useRef } from 'react';
import { useAdminCustomQuery } from "medusa-react"
import { CircularProgress, Grid } from "@mui/material";
import { Alert, Heading, Container, Text } from "@medusajs/ui"
import { EmailSentType } from "../types/models";

type EmailPreview = {
  htmlContent: string
}

export type AdminMarketingEmailPreviewQueryReq = {
  templateType: string,
  templateName: string,
  emailType: string
};
export type AdminMarketingEmailPreviewResponse = {
  result?: EmailPreview
}

const HtmlPreview = ({ htmlContent }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (iframeRef.current) {
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();
    }
  }, [htmlContent]);

  return (
    <iframe
      ref={iframeRef}
      style={{
        width: '100%',
        height: '800px',
        border: '1px solid #ccc'
      }}
    />
  );
};

const Preview = ({subject, emailType, templateName, templateType} : 
  {subject?: string, emailType: EmailSentType, templateName: string, templateType: string}) => {
  const { data, isLoading } = useAdminCustomQuery
  <AdminMarketingEmailPreviewQueryReq, AdminMarketingEmailPreviewResponse>(
    "/marketing/email-preview",
    [''],
    {
      templateType: templateType,
      templateName: templateName,
      emailType: emailType
    }
  )

  if (isLoading) {
    return (
      <CircularProgress/>
    )
  }

  if (data && data.result) {
    return (
      <Grid container direction={'column'} rowSpacing={2}>
        <Grid item>
          <Alert variant="success">Your email preview. It based on the last entities from database.</Alert>
        </Grid>
        <Grid item>
          <Container>
          <Grid container spacing={2} direction={'column'}>
            <Grid item>
              <Grid container alignItems={'baseline'}>
                <Grid item>
                  <Text>{`Email subject: `}</Text>
                </Grid>
                <Grid item marginLeft={1}>
                  <Heading level="h2">{subject ?? ''}</Heading>
                </Grid>
              </Grid>
            </Grid>
            <Grid item marginTop={2}>
               <HtmlPreview htmlContent={data.result.htmlContent}/>
            </Grid>
          </Grid>
          </Container>
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid container spacing={2}>
      <Grid item>
        <Alert variant="error">{'Cannot read template'}</Alert>
      </Grid>
    </Grid>
  ) 
}

export const PreviewEmail = ({subject, emailType, templateName, templateType } : 
  {subject?: string, emailType: EmailSentType, templateName?: string, templateType?: string, }) => {

  if (templateName && templateType) {
    return (
      <Preview subject={subject} emailType={emailType} templateName={templateName} templateType={templateType}/>
    )
  }
  return (
    <Alert variant='info'>
      Choose template to see preview
    </Alert>
  )
}
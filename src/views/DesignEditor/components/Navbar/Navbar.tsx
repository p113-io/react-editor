import React from "react"
import { useEditor } from "@layerhub-io/react"
import { Box, TapArea, Icon, Text, Spinner, FixedZIndex ,Modal, Layer , TextField} from 'gestalt'
import { HeaderText } from 'geru-components'
import { resizeImage } from '~/views/DesignEditor/utils/helper'
import {uploadTemporaryArtwork, saveTemplate} from "../../utils/services"
import _isEmpty from 'lodash/isEmpty'
import { toast } from 'react-toastify'
export default function () {

    //const { dimensions, setDimensions } = useAppContext()
    const editor = useEditor()
    const [is_saving, setIsSaving] = React.useState(false)
    const [templateName, setTemplateName] = React.useState("")

    const [fetching, setFetching] = React.useState(false)
    const [public_id, setPublicId] = React.useState(`test${Math.floor(Math.random() * 100)}`)
    const [templateModal, setTemplateModal] = React.useState(false)
    const [options, setOptions] = React.useState({})
    const zIndex = new FixedZIndex(99)

    const makeDownloadTemplate = async () => {
        const template = editor.scene.exportToJSON()
        template.layers = template.layers.filter((layer) => layer.id != 'background')

        const image = (await editor.renderer.render(template)) as string

        const resized = (await resizeImage(image, 1000, 1000)) as string

        const a = document.createElement("a")
        a.href = resized
        
        a.download = "image.png"
        a.click()
    }

    const onSaveTemplate = async () => {
        if(templateName.length == 0 || templateName.length === null ) {
            toast.warning('Та template-ийнхаа нэрийг оруулна уу?')
            return true
        }
        const template = editor.scene.exportToJSON()
        const image = (await editor.renderer.render(template)) as string

        
        const resized = await resizeImage(image)
        const pId = `template_${Math.floor(Math.random() * 100)}_${Math.floor(Math.random() * 100000)}`
        setPublicId(pId)
        setFetching(true)

        uploadTemporaryArtwork(resized, pId, function(err, result) {
            if(err) {
                setFetching(false)
                alert(err)
                return
            }

            setFetching(true)
            saveTemplate({
                editor_json: template,
                preview_url: result.secure_url,
                name: templateName
            })
            .then(res => {
                if(res.data.code != 0) {
                    alert(res.data.errors[0].msg)
                }
                if(res.data.code == 0) {
                    setTemplateModal(!templateModal)
                }
            })
            .catch(err => alert(err))
            .then(() => {
                setFetching(false) 
                setTemplateName("")
            })
        })
        
    }
    return (
        // @ts-ignore
        <Box width='100%' display="flex" justifyContent="end" alignItems="center" paddingX={6}>
            <TapArea tapStyle="compress" fullWidth={false} onTap={() => setTemplateModal(!templateModal)}>
                <Box color='dark' paddingY={2} paddingX={4} justifyContent='center' alignItems='center'  display='flex'>
                    <Icon 
                        icon="download"
                        accessibilityLabel="save"
                        size={16}
                        color='light'
                    />
                    <Box width={8} />
                    <Text color='light' weight='bold' align='center' overflow='noWrap'>{fetching ? "Saving ..." : "Save template"}</Text>
                </Box>
            </TapArea>
            <Box width={8} />
            <TapArea tapStyle="compress" fullWidth={false} onTap={makeDownloadTemplate}>
                <Box color='primary' paddingY={2} paddingX={4} justifyContent='center' alignItems='center' display='flex'>
                    <Icon 
                        icon="check-circle"
                        accessibilityLabel="save"
                        size={16}
                        color='light'
                    />
                    <Box width={8} />
                    <Text color='light' weight='bold' align='center'>Done</Text>
                </Box>
            </TapArea>
            
            {
                is_saving && (
                <Box position="absolute" left top height="100%" width="100%"
                    zIndex={zIndex}
                    display='flex'
                    alignItems="center"
                    direction='column'
                    justifyContent="center"
                    dangerouslySetInlineStyle={{
                        __style: {
                            backgroundColor:'rgba(0,0,30,0.4)',
                            backdropFilter: 'blur(10px)',
                            opacity: 1
                        }
                    }}
                >
                    <HeaderText color='white'>
                        Creating your work of art hold on a bit ...
                    </HeaderText>
                    <Box height={12} />
                    <Box color='light' rounding='circle' padding={1}> 
                        <Spinner accessibilityLabel='loading' show={true} />
                    </Box>
                </Box>
                )
            }
            {
                templateModal && (
                    <Layer zIndex={zIndex}>
                        <Modal
                            accessibilityModalLabel='template Modal'
                            onDismiss={() => setTemplateModal(!templateModal)}
                        >
                            <Box padding={4} >
                                <HeaderText align='center' weight='bold'>Save template as</HeaderText>
                                <Box height={20} />
                                <TextField
                                    id="template input"
                                    placeholder='template name'
                                    required
                                    onChange={({value}) => setTemplateName(value)}
                                />
                                <Box direction='row' display='flex' paddingY={4}>
                                    <TapArea onTap={() => setTemplateModal(!templateModal)}>
                                        <Box color='dark' padding={4}>
                                            <HeaderText align='center' size="md" color='white' weight='bold'>Cancel</HeaderText>
                                        </Box>
                                    </TapArea>
                                    <Box width={30} />
                                    <TapArea onTap={onSaveTemplate}>
                                        <Box color='errorBase' padding={4}>
                                            <HeaderText align='center'  size="md"  color='white' weight='bold'>Save</HeaderText>
                                        </Box>
                                    </TapArea>
                                </Box>
                            </Box>
                        </Modal>
                    </Layer>
                )
            }
            {
                fetching && (
                    <Layer zIndex={zIndex}>
                        <Modal
                            accessibilityModalLabel='template Modal'
                            onDismiss={() => {}}
                            size="lg"
                        >
                            <Box 
                                position="relative" 
                                zIndex={zIndex}
                                display='flex'
                                direction='column'
                                paddingY={10}
                                alignItems="center"
                                dangerouslySetInlineStyle={{
                                    __style: {
                                        backgroundColor:'black',
                                        backdropFilter: 'blur(20px)',
                                        opacity: 2
                                    }
                                }}> 
                                <HeaderText color='white'>
                                    Saving your template as 
                                </HeaderText>
                                <Box height={20} />
                                <HeaderText color='red'>
                                    {templateName}
                                </HeaderText>
                                <Box height={20} />
                                <Box color='light' rounding='circle' padding={1}> 
                                    <Spinner accessibilityLabel='loading' show={true} />
                                </Box>
                            </Box>
                        </Modal>
                    </Layer>
                )
            }
        </Box>
    )
}

import React from "react"
import { Button, SIZE, KIND } from "baseui/button"
import { Block } from "baseui/block"
import { StatefulTooltip, PLACEMENT } from "baseui/tooltip"
import { useActiveObject, useEditor } from "@layerhub-io/react"
import { StatefulPopover } from "baseui/popover"

import DeleteIcon from "~/components/Icons/Delete"
import LayersIcon from "~/components/Icons/Layers"
import AlignCenter from "~/components/Icons/AlignCenter"
import AlignLeft from "~/components/Icons/AlignLeft"
import AlignRight from "~/components/Icons/AlignRight"
import AlignTop from "~/components/Icons/AlignTop"
import AlignMiddle from "~/components/Icons/AlignMiddle"
import BringToFront from "~/components/Icons/BringToFront"
import SendToBack from "~/components/Icons/SendToBack"
import AlignBottom from "~/components/Icons/AlignBottom"

export default function () {
  const [state, setState] = React.useState({ isGroup: false, isMultiple: false })
  const activeObject = useActiveObject() as any

  const editor = useEditor()

  React.useEffect(() => {
    if (activeObject) {
      setState({ isGroup: activeObject.type === "group", isMultiple: activeObject.type === "activeSelection" })
    }
  }, [activeObject])

  React.useEffect(() => {
    let watcher = async () => {
      if (activeObject) {
        // @ts-ignore
        setState({ isGroup: activeObject.type === "group", isMultiple: activeObject.type === "activeSelection" })
      }
    }
    if (editor) {
      editor.on("history:changed", watcher)
    }
    return () => {
      if (editor) {
        editor.off("history:changed", watcher)
      }
    }
  }, [editor, activeObject])

  return (
    <Block $style={{ display: "flex", alignItems: "center" }}>
      <CommonAlign />
      
      {state.isGroup ? (
        <Button
          onClick={() => {
            editor.objects.ungroup()
            setState({ ...state, isGroup: false })
          }}
          size={SIZE.compact}
          kind={KIND.tertiary}
        >
          Ungroup
        </Button>
      ) : state.isMultiple ? (
        <Button
          onClick={() => {
            editor.objects.group()
            setState({ ...state, isGroup: true })
          }}
          size={SIZE.compact}
          kind={KIND.tertiary}
        >
          Group
        </Button>
      ) : null}

      {(state.isGroup || !state.isMultiple) && <CommonLayers />}

      
      {/* <Opacity /> */}
      {/* <LockUnlock /> */}
      {/* <StatefulTooltip placement={PLACEMENT.bottom} showArrow={true} accessibilityType={"tooltip"} content="Duplicate">
        <Button onClick={() => editor.objects.clone()} size={SIZE.mini} kind={KIND.tertiary}>
          <DuplicateIcon size={22} />
        </Button>
      </StatefulTooltip> */}
      <StatefulTooltip placement={PLACEMENT.bottom} showArrow={true} accessibilityType={"tooltip"} content="Delete">
        <Button onClick={() => editor.objects.remove()} size={SIZE.mini} kind={KIND.tertiary}>
          <DeleteIcon size={24} />
        </Button>
      </StatefulTooltip>
    </Block>
  )
}

function CommonLayers() {
  const editor = useEditor()
  const [checked, setChecked] = React.useState(true)
  const activeObject = useActiveObject()

  React.useEffect(() => {
    if (activeObject) {
      //  @ts-ignore
      setChecked(!!activeObject.clipPath)
    }
  }, [activeObject])
  return (
    <StatefulPopover
      placement={PLACEMENT.bottomRight}
      content={() => (
        <Block padding={"12px"} backgroundColor={"#ffffff"}>
          <Block display={"grid"} gridTemplateColumns={"1fr 1fr"} gridGap={"8px"}>
            <Button
              startEnhancer={<BringToFront size={24} />}
              onClick={() => editor.objects.bringToFront()}
              kind={KIND.tertiary}
              size={SIZE.mini}
            >
              Bring to front
            </Button>
            <Button
              startEnhancer={<SendToBack size={24} />}
              onClick={() => editor.objects.sendToBack()}
              kind={KIND.tertiary}
              size={SIZE.mini}
            >
              Send to back
            </Button>
          </Block>
        </Block>
      )}
      returnFocus
      autoFocus
    >
      <Block>
        <StatefulTooltip placement={PLACEMENT.bottom} showArrow={true} accessibilityType={"tooltip"} content="Layers">
          <Button size={SIZE.mini} kind={KIND.tertiary}>
            <LayersIcon size={19} />
          </Button>
        </StatefulTooltip>
      </Block>
    </StatefulPopover>
  )
}

function CommonAlign() {
  const editor = useEditor()
  return (
    <StatefulPopover
      placement={PLACEMENT.bottomRight}
      content={() => (
        <Block
          padding={"12px"}
          backgroundColor={"#ffffff"}
          display={"grid"}
          gridTemplateColumns={"1fr 1fr 1fr"}
          gridGap={"8px"}
        >
          <Button onClick={() => editor.objects.alignLeft()} kind={KIND.tertiary} size={SIZE.mini}>
            <AlignLeft size={24} />
          </Button>
          <Button onClick={() => editor.objects.alignCenter()} kind={KIND.tertiary} size={SIZE.mini}>
            <AlignCenter size={24} />
          </Button>
          <Button onClick={() => editor.objects.alignRight()} kind={KIND.tertiary} size={SIZE.mini}>
            <AlignRight size={24} />
          </Button>
          <Button onClick={() => editor.objects.alignTop()} kind={KIND.tertiary} size={SIZE.mini}>
            <AlignTop size={24} />
          </Button>
          <Button onClick={() => editor.objects.alignMiddle()} kind={KIND.tertiary} size={SIZE.mini}>
            <AlignMiddle size={24} />
          </Button>
          <Button onClick={() => editor.objects.alignBottom()} kind={KIND.tertiary} size={SIZE.mini}>
            <AlignBottom size={24} />
          </Button>
        </Block>
      )}
      returnFocus
      autoFocus
    >
      <Block>
        <StatefulTooltip placement={PLACEMENT.bottom} showArrow={true} accessibilityType={"tooltip"} content="Align">
          <Button size={SIZE.mini} kind={KIND.tertiary}>
            <AlignCenter size={24} />
          </Button>
        </StatefulTooltip>
      </Block>
    </StatefulPopover>
  )
}

import {TrashIcon} from '@sanity/icons'
import {Button, Stack} from '@sanity/ui'
import {useCallback} from 'react'
import {type ObjectInputProps, unset} from 'sanity'

/**
 * Custom input for a gallery image. Renders the normal image form (asset +
 * alt text) and adds a "Remove image from gallery" button at the bottom of the
 * dialog that pops up when you click an image.
 *
 * `onChange(unset())` removes this item from the parent gallery array, which
 * also closes the dialog (the item no longer exists). The underlying file is
 * left untouched in the Media library.
 */
export function GalleryImageInput(props: ObjectInputProps) {
  const {onChange, renderDefault} = props
  const handleRemove = useCallback(() => onChange(unset()), [onChange])

  return (
    <Stack space={4}>
      {renderDefault(props)}
      <Button
        text="Remove image from gallery"
        icon={TrashIcon}
        tone="critical"
        mode="ghost"
        onClick={handleRemove}
      />
    </Stack>
  )
}

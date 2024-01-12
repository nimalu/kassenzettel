import glob
import bpy, sys, os
import mathutils

def augment_img(img_in, img_out):
    bpy.data.images.load(img_in, check_existing=True)
    imageBaseName = bpy.path.basename(img_in)

    plane = bpy.data.objects['Plane']
    mat = plane.material_slots['receipt'].material
    image_node = mat.node_tree.nodes["Image Texture"]
    img = bpy.data.images.get(imageBaseName)
    image_node.image = img

    size = img.size
    ratio = 8 / size[1]
    plane.dimensions = mathutils.Vector((ratio * size[1], ratio * size[0], 0.2))

    bpy.context.scene.render.filepath = img_out
    bpy.ops.render.render(write_still=True)

for f in glob.glob("kassenzettel/images/*.png"):
    basename = os.path.basename(f)
    augment_img(f, f"kassenzettel/images_augmented/{basename}")

for f in glob.glob("kassenzettel/masks/*.png"):
    basename = os.path.basename(f)
    augment_img(f, f"kassenzettel/mask_augmented/{basename}")
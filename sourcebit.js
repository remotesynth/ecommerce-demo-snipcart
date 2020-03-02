module.exports = {
  plugins: [
    {
      module: require('sourcebit-source-sanity'),
      options: {
        accessToken: process.env['SANITY_ACCESS_TOKEN'],
        dataset: 'production',
        projectId: '5e9ap4u6',
        useCdn: false
      }
    },
    {
      module: require('sourcebit-transform-assets'),
      options: {
        assetPath: function(entry,asset) {
          return [
            "static/images/products",
            [asset.__metadata.id, asset.fileName].join("-")
          ].join("/");
        },
        publicUrl: function(entry,asset,assetPath) {
          return [
            "/images/products",
            [asset.__metadata.id, asset.fileName].join("-")
          ].join("/");
        }
      }
    },
    {
      module: require('sourcebit-target-hugo'),
      options: {
        writeFile: function(entry,utils) {
          // This function is invoked for each entry and its return value determines
          // whether the entry will be written to a file. When an object with `content`,
          // `format` and `path` properties is returned, a file will be written with
          // those parameters. If a falsy value is returned, no file will be created.
          const { __metadata: meta, ...fields } = entry;
          
          if (!meta) return;
          
          const { createdAt = '', modelName, projectId, source } = meta;
          
          if (modelName === 'product' && projectId === '5e9ap4u6' && source === 'sourcebit-source-sanity') {
            const { __metadata = {}, 'body': content, ...frontmatterFields } = entry;
          
            if (typeof entry.__metadata.createdAt === 'string') {
              frontmatterFields.date = entry.__metadata.createdAt.split('T')[0]
            }
          
            return {
              content: {
                body: fields['body'],
                frontmatter: frontmatterFields,
              },
              format: 'frontmatter-md',
              path: 'content/products/' + utils.slugify(fields['title']) + '.md'
            };
          }
        }
      }
    }
  ]
}

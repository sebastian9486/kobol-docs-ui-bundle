'use strict'

const autoprefixer = require('autoprefixer')
const browserify = require('browserify')
const buffer = require('vinyl-buffer')
const concat = require('gulp-concat')
const fs = require('fs-extra')
const imagemin = require('gulp-imagemin')
const { obj: map } = require('through2')
const merge = require('merge-stream')
const postcss = require('gulp-postcss')
const uglify = require('gulp-uglify')
const vfs = require('vinyl-fs')
const sass = require('gulp-sass')
sass.compiler = require('node-sass')

const sassSrc = 'stylesheets/site.scss'

module.exports = (src, dest, preview) => () => {
  const opts = { base: src, cwd: src }
  const sourcemaps = preview || process.env.SOURCEMAPS === 'true'

  const postcssPlugins = [
    require('@csstools/postcss-sass'),
    autoprefixer(),
  ]

  return merge(
    vfs
      .src('js/+([0-9])-*.js', { ...opts, sourcemaps })
      .pipe(uglify())
      .pipe(concat('js/site.js')),
    vfs
      .src('js/vendor/*.js', { ...opts, read: false })
      .pipe(
        // see https://gulpjs.org/recipes/browserify-multiple-destination.html
        map((file, enc, next) => {
          if (file.relative.endsWith('.bundle.js')) {
            file.contents = browserify(file.relative, { basedir: src, detectGlobals: false })
              .plugin('browser-pack-flat/plugin')
              .bundle()
            file.path = file.path.slice(0, file.path.length - 10) + '.js'
            next(null, file)
          } else {
            fs.readFile(file.path, 'UTF-8').then((contents) => {
              file.contents = Buffer.from(contents)
              next(null, file)
            })
          }
        })
      )
      .pipe(buffer())
      .pipe(uglify()),
    vfs
      .src(sassSrc, { ...opts, sourcemaps })
      .pipe(postcss(postcssPlugins))
      .pipe(sass()),
    vfs.src('font/*.{ttf,woff*(2)}', opts),
    vfs
      .src('img/**/*.{gif,ico,jpg,png,svg}', opts)
      .pipe(
        imagemin([
          imagemin.optipng(),
          imagemin.svgo({ plugins: [{ removeViewBox: false }] }),
        ].reduce((accum, it) => it ? accum.concat(it) : accum, []))
      ),
    vfs.src('helpers/*.js', opts),
    vfs.src('layouts/*.hbs', opts),
    vfs.src('partials/*.hbs', opts)
  ).pipe(vfs.dest(dest, { sourcemaps: sourcemaps && '.' }))
}

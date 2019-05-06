# Dockerfile extending the generic Node image with application files for a
# single application.
FROM gcr.io/google_appengine/nodejs
# Expose endpoints on port 9090
EXPOSE 3000
ENV WORKSPACE=/app
ENV USER=jrodriguez
ENV GROUP=jrodriguez
# Check to see if the the version included in the base runtime satisfies
# '>=9.4.0', if not then do an npm install of the latest available
# version that satisfies it.
RUN /usr/local/bin/install_node '>=9.4.0'
RUN node -v

RUN echo $GROUP

RUN addgroup --gid 1000 $GROUP && adduser --system --uid 1000 --ingroup $GROUP $USER

RUN mkdir -p $WORKSPACE/lib && chown -R $GROUP:$USER $WORKSPACE

USER $USER

WORKDIR $WORKSPACE

ADD index.js $WORKSPACE
ADD package.json $WORKSPACE
ADD .env $WORKSPACE
ADD lib $WORKSPACE/lib

# You have to specify "--unsafe-perm" with npm install
# when running as root.  Failing to do this can cause
# install to appear to succeed even if a preinstall
# script fails, and may have other adverse consequences
# as well.
# This command will also cat the npm-debug.log file after the
# build, if it exists.
RUN npm install --unsafe-perm || \
  ((if [ -f npm-debug.log ]; then \
      cat npm-debug.log; \
    fi) && false)

RUN ls $WORKSPACE
RUN cat index.js

ENTRYPOINT [ "sh", "-c", "cd $WORKSPACE && node index.js" ]

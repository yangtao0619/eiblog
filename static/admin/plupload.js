(function (f, h, e) {
    var d = f.setTimeout, g = {};

    function a(j) {
        var i = j.required_features, k = {};

        function l(n, o, m) {
            var p = {
                chunks: "slice_blob",
                jpgresize: "send_binary_string",
                pngresize: "send_binary_string",
                progress: "report_upload_progress",
                multi_selection: "select_multiple",
                dragdrop: "drag_and_drop",
                drop_element: "drag_and_drop",
                headers: "send_custom_headers",
                urlstream_upload: "send_binary_string",
                canSendBinary: "send_binary",
                triggerDialog: "summon_file_dialog"
            };
            if (p[n]) {
                k[p[n]] = o
            } else {
                if (!m) {
                    k[n] = o
                }
            }
        }

        if (typeof(i) === "string") {
            c.each(i.split(/\s*,\s*/), function (m) {
                l(m, true)
            })
        } else {
            if (typeof(i) === "object") {
                c.each(i, function (n, m) {
                    l(m, n)
                })
            } else {
                if (i === true) {
                    if (j.chunk_size > 0) {
                        k.slice_blob = true
                    }
                    if (j.resize.enabled || !j.multipart) {
                        k.send_binary_string = true
                    }
                    c.each(j, function (n, m) {
                        l(m, !!n, true)
                    })
                }
            }
        }
        return k
    }

    var c = {
        VERSION: "2.1.8",
        STOPPED: 1,
        STARTED: 2,
        QUEUED: 1,
        UPLOADING: 2,
        FAILED: 4,
        DONE: 5,
        GENERIC_ERROR: -100,
        HTTP_ERROR: -200,
        IO_ERROR: -300,
        SECURITY_ERROR: -400,
        INIT_ERROR: -500,
        FILE_SIZE_ERROR: -600,
        FILE_EXTENSION_ERROR: -601,
        FILE_DUPLICATE_ERROR: -602,
        IMAGE_FORMAT_ERROR: -700,
        MEMORY_ERROR: -701,
        IMAGE_DIMENSIONS_ERROR: -702,
        mimeTypes: h.mimes,
        ua: h.ua,
        typeOf: h.typeOf,
        extend: h.extend,
        guid: h.guid,
        get: function b(m) {
            var k = [], l;
            if (h.typeOf(m) !== "array") {
                m = [m]
            }
            var j = m.length;
            while (j--) {
                l = h.get(m[j]);
                if (l) {
                    k.push(l)
                }
            }
            return k.length ? k : null
        },
        each: h.each,
        getPos: h.getPos,
        getSize: h.getSize,
        xmlEncode: function (j) {
            var k = {"<": "lt", ">": "gt", "&": "amp", '"': "quot", "'": "#39"}, i = /[<>&\"\']/g;
            return j ? ("" + j).replace(i, function (l) {
                return k[l] ? "&" + k[l] + ";" : l
            }) : j
        },
        toArray: h.toArray,
        inArray: h.inArray,
        addI18n: h.addI18n,
        translate: h.translate,
        isEmptyObj: h.isEmptyObj,
        hasClass: h.hasClass,
        addClass: h.addClass,
        removeClass: h.removeClass,
        getStyle: h.getStyle,
        addEvent: h.addEvent,
        removeEvent: h.removeEvent,
        removeAllEvents: h.removeAllEvents,
        cleanName: function (j) {
            var k, l;
            l = [/[\300-\306]/g, "A", /[\340-\346]/g, "a", /\307/g, "C", /\347/g, "c", /[\310-\313]/g, "E", /[\350-\353]/g, "e", /[\314-\317]/g, "I", /[\354-\357]/g, "i", /\321/g, "N", /\361/g, "n", /[\322-\330]/g, "O", /[\362-\370]/g, "o", /[\331-\334]/g, "U", /[\371-\374]/g, "u"];
            for (k = 0; k < l.length; k += 2) {
                j = j.replace(l[k], l[k + 1])
            }
            j = j.replace(/\s+/g, "_");
            j = j.replace(/[^a-z0-9_\-\.]+/gi, "");
            return j
        },
        buildUrl: function (j, i) {
            var k = "";
            c.each(i, function (m, l) {
                k += (k ? "&" : "") + encodeURIComponent(l) + "=" + encodeURIComponent(m)
            });
            if (k) {
                j += (j.indexOf("?") > 0 ? "&" : "?") + k
            }
            return j
        },
        formatSize: function (j) {
            if (j === e || /\D/.test(j)) {
                return c.translate("N/A")
            }

            function i(m, l) {
                return Math.round(m * Math.pow(10, l)) / Math.pow(10, l)
            }

            var k = Math.pow(1024, 4);
            if (j > k) {
                return i(j / k, 1) + " " + c.translate("tb")
            }
            if (j > (k /= 1024)) {
                return i(j / k, 1) + " " + c.translate("gb")
            }
            if (j > (k /= 1024)) {
                return i(j / k, 1) + " " + c.translate("mb")
            }
            if (j > 1024) {
                return Math.round(j / 1024) + " " + c.translate("kb")
            }
            return j + " " + c.translate("b")
        },
        parseSize: h.parseSizeStr,
        predictRuntime: function (k, j) {
            var i, l;
            i = new c.Uploader(k);
            l = h.Runtime.thatCan(i.getOption().required_features, j || k.runtimes);
            i.destroy();
            return l
        },
        addFileFilter: function (j, i) {
            g[j] = i
        }
    };
    c.addFileFilter("mime_types", function (k, j, i) {
        if (k.length && !k.regexp.test(j.name)) {
            this.trigger("Error", {
                code: c.FILE_EXTENSION_ERROR,
                message: c.translate("File extension error."),
                file: j
            });
            i(false)
        } else {
            i(true)
        }
    });
    c.addFileFilter("max_file_size", function (l, j, i) {
        var k;
        l = c.parseSize(l);
        if (j.size !== k && l && j.size > l) {
            this.trigger("Error", {code: c.FILE_SIZE_ERROR, message: c.translate("File size error."), file: j});
            i(false)
        } else {
            i(true)
        }
    });
    c.addFileFilter("prevent_duplicates", function (l, j, i) {
        if (l) {
            var k = this.files.length;
            while (k--) {
                if (j.name === this.files[k].name && j.size === this.files[k].size) {
                    this.trigger("Error", {
                        code: c.FILE_DUPLICATE_ERROR,
                        message: c.translate("Duplicate file error."),
                        file: j
                    });
                    i(false);
                    return
                }
            }
        }
        i(true)
    });
    c.Uploader = function (l) {
        var t = c.guid(), G, p = [], x = {}, F = [], w = [], C, J, n = false, v;

        function I() {
            var L, M = 0, K;
            if (this.state == c.STARTED) {
                for (K = 0; K < p.length; K++) {
                    if (!L && p[K].status == c.QUEUED) {
                        L = p[K];
                        if (this.trigger("BeforeUpload", L)) {
                            L.status = c.UPLOADING;
                            this.trigger("UploadFile", L)
                        }
                    } else {
                        M++
                    }
                }
                if (M == p.length) {
                    if (this.state !== c.STOPPED) {
                        this.state = c.STOPPED;
                        this.trigger("StateChanged")
                    }
                    this.trigger("UploadComplete", p)
                }
            }
        }

        function k(K) {
            K.percent = K.size > 0 ? Math.ceil(K.loaded / K.size * 100) : 100;
            j()
        }

        function j() {
            var L, K;
            J.reset();
            for (L = 0; L < p.length; L++) {
                K = p[L];
                if (K.size !== e) {
                    J.size += K.origSize;
                    J.loaded += K.loaded * K.origSize / K.size
                } else {
                    J.size = e
                }
                if (K.status == c.DONE) {
                    J.uploaded++
                } else {
                    if (K.status == c.FAILED) {
                        J.failed++
                    } else {
                        J.queued++
                    }
                }
            }
            if (J.size === e) {
                J.percent = p.length > 0 ? Math.ceil(J.uploaded / p.length * 100) : 0
            } else {
                J.bytesPerSec = Math.ceil(J.loaded / ((+new Date() - C || 1) / 1000));
                J.percent = J.size > 0 ? Math.ceil(J.loaded / J.size * 100) : 0
            }
        }

        function H() {
            var K = F[0] || w[0];
            if (K) {
                return K.getRuntime().uid
            }
            return false
        }

        function E(L, K) {
            if (L.ruid) {
                var M = h.Runtime.getInfo(L.ruid);
                if (M) {
                    return M.can(K)
                }
            }
            return false
        }

        function y() {
            this.bind("FilesAdded FilesRemoved", function (K) {
                K.trigger("QueueChanged");
                K.refresh()
            });
            this.bind("CancelUpload", i);
            this.bind("BeforeUpload", B);
            this.bind("UploadFile", D);
            this.bind("UploadProgress", u);
            this.bind("StateChanged", A);
            this.bind("QueueChanged", j);
            this.bind("Error", r);
            this.bind("FileUploaded", s);
            this.bind("Destroy", q)
        }

        function z(P, M) {
            var N = this, L = 0, K = [];
            var O = {
                runtime_order: P.runtimes,
                required_caps: P.required_features,
                preferred_caps: x,
                swf_url: P.flash_swf_url,
                xap_url: P.silverlight_xap_url
            };
            c.each(P.runtimes.split(/\s*,\s*/), function (Q) {
                if (P[Q]) {
                    O[Q] = P[Q]
                }
            });
            if (P.browse_button) {
                c.each(P.browse_button, function (Q) {
                    K.push(function (R) {
                        var S = new h.FileInput(c.extend({}, O, {
                            accept: P.filters.mime_types,
                            name: P.file_data_name,
                            multiple: P.multi_selection,
                            container: P.container,
                            browse_button: Q
                        }));
                        S.onready = function () {
                            var T = h.Runtime.getInfo(this.ruid);
                            h.extend(N.features, {
                                chunks: T.can("slice_blob"),
                                multipart: T.can("send_multipart"),
                                multi_selection: T.can("select_multiple")
                            });
                            L++;
                            F.push(this);
                            R()
                        };
                        S.onchange = function () {
                            N.addFile(this.files)
                        };
                        S.bind("mouseenter mouseleave mousedown mouseup", function (T) {
                            if (!n) {
                                if (P.browse_button_hover) {
                                    if ("mouseenter" === T.type) {
                                        h.addClass(Q, P.browse_button_hover)
                                    } else {
                                        if ("mouseleave" === T.type) {
                                            h.removeClass(Q, P.browse_button_hover)
                                        }
                                    }
                                }
                                if (P.browse_button_active) {
                                    if ("mousedown" === T.type) {
                                        h.addClass(Q, P.browse_button_active)
                                    } else {
                                        if ("mouseup" === T.type) {
                                            h.removeClass(Q, P.browse_button_active)
                                        }
                                    }
                                }
                            }
                        });
                        S.bind("mousedown", function () {
                            N.trigger("Browse")
                        });
                        S.bind("error runtimeerror", function () {
                            S = null;
                            R()
                        });
                        S.init()
                    })
                })
            }
            if (P.drop_element) {
                c.each(P.drop_element, function (Q) {
                    K.push(function (R) {
                        var S = new h.FileDrop(c.extend({}, O, {drop_zone: Q}));
                        S.onready = function () {
                            var T = h.Runtime.getInfo(this.ruid);
                            N.features.dragdrop = T.can("drag_and_drop");
                            L++;
                            w.push(this);
                            R()
                        };
                        S.ondrop = function () {
                            N.addFile(this.files)
                        };
                        S.bind("error runtimeerror", function () {
                            S = null;
                            R()
                        });
                        S.init()
                    })
                })
            }
            h.inSeries(K, function () {
                if (typeof(M) === "function") {
                    M(L)
                }
            })
        }

        function o(M, O, K) {
            var L = new h.Image();
            try {
                L.onload = function () {
                    if (O.width > this.width && O.height > this.height && O.quality === e && O.preserve_headers && !O.crop) {
                        this.destroy();
                        return K(M)
                    }
                    L.downsize(O.width, O.height, O.crop, O.preserve_headers)
                };
                L.onresize = function () {
                    K(this.getAsBlob(M.type, O.quality));
                    this.destroy()
                };
                L.onerror = function () {
                    K(M)
                };
                L.load(M)
            } catch (N) {
                K(M)
            }
        }

        function m(M, O, P) {
            var L = this, K = false;

            function N(R, S, T) {
                var Q = G[R];
                switch (R) {
                    case"max_file_size":
                        if (R === "max_file_size") {
                            G.max_file_size = G.filters.max_file_size = S
                        }
                        break;
                    case"chunk_size":
                        if (S = c.parseSize(S)) {
                            G[R] = S;
                            G.send_file_name = true
                        }
                        break;
                    case"multipart":
                        G[R] = S;
                        if (!S) {
                            G.send_file_name = true
                        }
                        break;
                    case"unique_names":
                        G[R] = S;
                        if (S) {
                            G.send_file_name = true
                        }
                        break;
                    case"filters":
                        if (c.typeOf(S) === "array") {
                            S = {mime_types: S}
                        }
                        if (T) {
                            c.extend(G.filters, S)
                        } else {
                            G.filters = S
                        }
                        if (S.mime_types) {
                            G.filters.mime_types.regexp = (function (U) {
                                var V = [];
                                c.each(U, function (W) {
                                    c.each(W.extensions.split(/,/), function (X) {
                                        if (/^\s*\*\s*$/.test(X)) {
                                            V.push("\\.*")
                                        } else {
                                            V.push("\\." + X.replace(new RegExp("[" + ("/^$.*+?|()[]{}\\".replace(/./g, "\\$&")) + "]", "g"), "\\$&"))
                                        }
                                    })
                                });
                                return new RegExp("(" + V.join("|") + ")$", "i")
                            }(G.filters.mime_types))
                        }
                        break;
                    case"resize":
                        if (T) {
                            c.extend(G.resize, S, {enabled: true})
                        } else {
                            G.resize = S
                        }
                        break;
                    case"prevent_duplicates":
                        G.prevent_duplicates = G.filters.prevent_duplicates = !!S;
                        break;
                    case"browse_button":
                    case"drop_element":
                        S = c.get(S);
                    case"container":
                    case"runtimes":
                    case"multi_selection":
                    case"flash_swf_url":
                    case"silverlight_xap_url":
                        G[R] = S;
                        if (!T) {
                            K = true
                        }
                        break;
                    default:
                        G[R] = S
                }
                if (!T) {
                    L.trigger("OptionChanged", R, S, Q)
                }
            }

            if (typeof(M) === "object") {
                c.each(M, function (R, Q) {
                    N(Q, R, P)
                })
            } else {
                N(M, O, P)
            }
            if (P) {
                G.required_features = a(c.extend({}, G));
                x = a(c.extend({}, G, {required_features: true}))
            } else {
                if (K) {
                    L.trigger("Destroy");
                    z.call(L, G, function (Q) {
                        if (Q) {
                            L.runtime = h.Runtime.getInfo(H()).type;
                            L.trigger("Init", {runtime: L.runtime});
                            L.trigger("PostInit")
                        } else {
                            L.trigger("Error", {code: c.INIT_ERROR, message: c.translate("Init error.")})
                        }
                    })
                }
            }
        }

        function B(K, L) {
            if (K.settings.unique_names) {
                var N = L.name.match(/\.([^.]+)$/), M = "part";
                if (N) {
                    M = N[1]
                }
                L.target_name = L.id + "." + M
            }
        }

        function D(S, P) {
            var M = S.settings.url, Q = S.settings.chunk_size, T = S.settings.max_retries, N = S.features, R = 0, K;
            if (P.loaded) {
                R = P.loaded = Q ? Q * Math.floor(P.loaded / Q) : 0
            }

            function O() {
                if (T-- > 0) {
                    d(L, 1000)
                } else {
                    P.loaded = R;
                    S.trigger("Error", {
                        code: c.HTTP_ERROR,
                        message: c.translate("HTTP Error."),
                        file: P,
                        response: v.responseText,
                        status: v.status,
                        responseHeaders: v.getAllResponseHeaders()
                    })
                }
            }

            function L() {
                var W, V, U = {}, X;
                if (P.status !== c.UPLOADING || S.state === c.STOPPED) {
                    return
                }
                if (S.settings.send_file_name) {
                    U.name = P.target_name || P.name
                }
                if (Q && N.chunks && K.size > Q) {
                    X = Math.min(Q, K.size - R);
                    W = K.slice(R, R + X)
                } else {
                    X = K.size;
                    W = K
                }
                if (Q && N.chunks) {
                    if (S.settings.send_chunk_number) {
                        U.chunk = Math.ceil(R / Q);
                        U.chunks = Math.ceil(K.size / Q)
                    } else {
                        U.offset = R;
                        U.total = K.size
                    }
                }
                v = new h.XMLHttpRequest();
                if (v.upload) {
                    v.upload.onprogress = function (Y) {
                        P.loaded = Math.min(P.size, R + Y.loaded);
                        S.trigger("UploadProgress", P)
                    }
                }
                v.onload = function () {
                    if (v.status >= 400) {
                        O();
                        return
                    }
                    T = S.settings.max_retries;
                    if (X < K.size) {
                        W.destroy();
                        R += X;
                        P.loaded = Math.min(R, K.size);
                        S.trigger("ChunkUploaded", P, {
                            offset: P.loaded,
                            total: K.size,
                            response: v.responseText,
                            status: v.status,
                            responseHeaders: v.getAllResponseHeaders()
                        });
                        if (h.Env.browser === "Android Browser") {
                            S.trigger("UploadProgress", P)
                        }
                    } else {
                        P.loaded = P.size
                    }
                    W = V = null;
                    if (!R || R >= K.size) {
                        if (P.size != P.origSize) {
                            K.destroy();
                            K = null
                        }
                        S.trigger("UploadProgress", P);
                        P.status = c.DONE;
                        S.trigger("FileUploaded", P, {
                            response: v.responseText,
                            status: v.status,
                            responseHeaders: v.getAllResponseHeaders()
                        })
                    } else {
                        d(L, 1)
                    }
                };
                v.onerror = function () {
                    O()
                };
                v.onloadend = function () {
                    this.destroy();
                    v = null
                };
                if (S.settings.multipart && N.multipart) {
                    v.open("post", M, true);
                    c.each(S.settings.headers, function (Z, Y) {
                        v.setRequestHeader(Y, Z)
                    });
                    V = new h.FormData();
                    c.each(c.extend(U, S.settings.multipart_params), function (Z, Y) {
                        V.append(Y, Z)
                    });
                    V.append(S.settings.file_data_name, W);
                    v.send(V, {
                        runtime_order: S.settings.runtimes,
                        required_caps: S.settings.required_features,
                        preferred_caps: x,
                        swf_url: S.settings.flash_swf_url,
                        xap_url: S.settings.silverlight_xap_url
                    })
                } else {
                    M = c.buildUrl(S.settings.url, c.extend(U, S.settings.multipart_params));
                    v.open("post", M, true);
                    v.setRequestHeader("Content-Type", "application/octet-stream");
                    c.each(S.settings.headers, function (Z, Y) {
                        v.setRequestHeader(Y, Z)
                    });
                    v.send(W, {
                        runtime_order: S.settings.runtimes,
                        required_caps: S.settings.required_features,
                        preferred_caps: x,
                        swf_url: S.settings.flash_swf_url,
                        xap_url: S.settings.silverlight_xap_url
                    })
                }
            }

            K = P.getSource();
            if (S.settings.resize.enabled && E(K, "send_binary_string") && !!~h.inArray(K.type, ["image/jpeg", "image/png"])) {
                o.call(this, K, S.settings.resize, function (U) {
                    K = U;
                    P.size = U.size;
                    L()
                })
            } else {
                L()
            }
        }

        function u(K, L) {
            k(L)
        }

        function A(K) {
            if (K.state == c.STARTED) {
                C = (+new Date())
            } else {
                if (K.state == c.STOPPED) {
                    for (var L = K.files.length - 1; L >= 0; L--) {
                        if (K.files[L].status == c.UPLOADING) {
                            K.files[L].status = c.QUEUED;
                            j()
                        }
                    }
                }
            }
        }

        function i() {
            if (v) {
                v.abort()
            }
        }

        function s(K) {
            j();
            d(function () {
                I.call(K)
            }, 1)
        }

        function r(K, L) {
            if (L.code === c.INIT_ERROR) {
                K.destroy()
            } else {
                if (L.code === c.HTTP_ERROR) {
                    L.file.status = c.FAILED;
                    k(L.file);
                    if (K.state == c.STARTED) {
                        K.trigger("CancelUpload");
                        d(function () {
                            I.call(K)
                        }, 1)
                    }
                }
            }
        }

        function q(K) {
            K.stop();
            c.each(p, function (L) {
                L.destroy()
            });
            p = [];
            if (F.length) {
                c.each(F, function (L) {
                    L.destroy()
                });
                F = []
            }
            if (w.length) {
                c.each(w, function (L) {
                    L.destroy()
                });
                w = []
            }
            x = {};
            n = false;
            C = v = null;
            J.reset()
        }

        G = {
            runtimes: h.Runtime.order,
            max_retries: 0,
            chunk_size: 0,
            multipart: true,
            multi_selection: true,
            file_data_name: "file",
            flash_swf_url: "js/Moxie.swf",
            silverlight_xap_url: "js/Moxie.xap",
            filters: {mime_types: [], prevent_duplicates: false, max_file_size: 0},
            resize: {enabled: false, preserve_headers: true, crop: false},
            send_file_name: true,
            send_chunk_number: true
        };
        m.call(this, l, null, true);
        J = new c.QueueProgress();
        c.extend(this, {
            id: t,
            uid: t,
            state: c.STOPPED,
            features: {},
            runtime: null,
            files: p,
            settings: G,
            total: J,
            init: function () {
                var K = this;
                if (typeof(G.preinit) == "function") {
                    G.preinit(K)
                } else {
                    c.each(G.preinit, function (M, L) {
                        K.bind(L, M)
                    })
                }
                y.call(this);
                if (!G.browse_button || !G.url) {
                    this.trigger("Error", {code: c.INIT_ERROR, message: c.translate("Init error.")});
                    return
                }
                z.call(this, G, function (L) {
                    if (typeof(G.init) == "function") {
                        G.init(K)
                    } else {
                        c.each(G.init, function (N, M) {
                            K.bind(M, N)
                        })
                    }
                    if (L) {
                        K.runtime = h.Runtime.getInfo(H()).type;
                        K.trigger("Init", {runtime: K.runtime});
                        K.trigger("PostInit")
                    } else {
                        K.trigger("Error", {code: c.INIT_ERROR, message: c.translate("Init error.")})
                    }
                })
            },
            setOption: function (K, L) {
                m.call(this, K, L, !this.runtime)
            },
            getOption: function (K) {
                if (!K) {
                    return G
                }
                return G[K]
            },
            refresh: function () {
                if (F.length) {
                    c.each(F, function (K) {
                        K.trigger("Refresh")
                    })
                }
                this.trigger("Refresh")
            },
            start: function () {
                if (this.state != c.STARTED) {
                    this.state = c.STARTED;
                    this.trigger("StateChanged");
                    I.call(this)
                }
            },
            stop: function () {
                if (this.state != c.STOPPED) {
                    this.state = c.STOPPED;
                    this.trigger("StateChanged");
                    this.trigger("CancelUpload")
                }
            },
            disableBrowse: function () {
                n = arguments[0] !== e ? arguments[0] : true;
                if (F.length) {
                    c.each(F, function (K) {
                        K.disable(n)
                    })
                }
                this.trigger("DisableBrowse", n)
            },
            getFile: function (L) {
                var K;
                for (K = p.length - 1; K >= 0; K--) {
                    if (p[K].id === L) {
                        return p[K]
                    }
                }
            },
            addFile: function (P, R) {
                var M = this, K = [], L = [], N;

                function Q(U, T) {
                    var S = [];
                    h.each(M.settings.filters, function (W, V) {
                        if (g[V]) {
                            S.push(function (X) {
                                g[V].call(M, W, U, function (Y) {
                                    X(!Y)
                                })
                            })
                        }
                    });
                    h.inSeries(S, T)
                }

                function O(S) {
                    var T = h.typeOf(S);
                    if (S instanceof h.File) {
                        if (!S.ruid && !S.isDetached()) {
                            if (!N) {
                                return false
                            }
                            S.ruid = N;
                            S.connectRuntime(N)
                        }
                        O(new c.File(S))
                    } else {
                        if (S instanceof h.Blob) {
                            O(S.getSource());
                            S.destroy()
                        } else {
                            if (S instanceof c.File) {
                                if (R) {
                                    S.name = R
                                }
                                K.push(function (U) {
                                    Q(S, function (V) {
                                        if (!V) {
                                            p.push(S);
                                            L.push(S);
                                            M.trigger("FileFiltered", S)
                                        }
                                        d(U, 1)
                                    })
                                })
                            } else {
                                if (h.inArray(T, ["file", "blob"]) !== -1) {
                                    O(new h.File(null, S))
                                } else {
                                    if (T === "node" && h.typeOf(S.files) === "filelist") {
                                        h.each(S.files, O)
                                    } else {
                                        if (T === "array") {
                                            R = null;
                                            h.each(S, O)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                N = H();
                O(P);
                if (K.length) {
                    h.inSeries(K, function () {
                        if (L.length) {
                            M.trigger("FilesAdded", L)
                        }
                    })
                }
            },
            removeFile: function (L) {
                var M = typeof(L) === "string" ? L : L.id;
                for (var K = p.length - 1; K >= 0; K--) {
                    if (p[K].id === M) {
                        return this.splice(K, 1)[0]
                    }
                }
            },
            splice: function (N, K) {
                var L = p.splice(N === e ? 0 : N, K === e ? p.length : K);
                var M = false;
                if (this.state == c.STARTED) {
                    c.each(L, function (O) {
                        if (O.status === c.UPLOADING) {
                            M = true;
                            return false
                        }
                    });
                    if (M) {
                        this.stop()
                    }
                }
                this.trigger("FilesRemoved", L);
                c.each(L, function (O) {
                    O.destroy()
                });
                if (M) {
                    this.start()
                }
                return L
            },
            dispatchEvent: function (N) {
                var O, L, K;
                N = N.toLowerCase();
                O = this.hasEventListener(N);
                if (O) {
                    O.sort(function (Q, P) {
                        return P.priority - Q.priority
                    });
                    L = [].slice.call(arguments);
                    L.shift();
                    L.unshift(this);
                    for (var M = 0; M < O.length; M++) {
                        if (O[M].fn.apply(O[M].scope, L) === false) {
                            return false
                        }
                    }
                }
                return true
            },
            bind: function (K, N, M, L) {
                c.Uploader.prototype.bind.call(this, K, N, L, M)
            },
            destroy: function () {
                this.trigger("Destroy");
                G = J = null;
                this.unbindAll()
            }
        })
    };
    c.Uploader.prototype = h.EventTarget.instance;
    c.File = (function () {
        var j = {};

        function i(k) {
            c.extend(this, {
                id: c.guid(),
                name: k.name || k.fileName,
                type: k.type || "",
                size: k.size || k.fileSize,
                origSize: k.size || k.fileSize,
                loaded: 0,
                percent: 0,
                status: c.QUEUED,
                lastModifiedDate: k.lastModifiedDate || (new Date()).toLocaleString(),
                getNative: function () {
                    var l = this.getSource().getSource();
                    return h.inArray(h.typeOf(l), ["blob", "file"]) !== -1 ? l : null
                },
                getSource: function () {
                    if (!j[this.id]) {
                        return null
                    }
                    return j[this.id]
                },
                destroy: function () {
                    var l = this.getSource();
                    if (l) {
                        l.destroy();
                        delete j[this.id]
                    }
                }
            });
            j[this.id] = k
        }

        return i
    }());
    c.QueueProgress = function () {
        var i = this;
        i.size = 0;
        i.loaded = 0;
        i.uploaded = 0;
        i.failed = 0;
        i.queued = 0;
        i.percent = 0;
        i.bytesPerSec = 0;
        i.reset = function () {
            i.size = i.loaded = i.uploaded = i.failed = i.queued = i.percent = i.bytesPerSec = 0
        }
    };
    f.plupload = c
}(window, mOxie));
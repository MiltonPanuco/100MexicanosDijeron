'use strict';

// Banco editable de preguntas. La lógica del juego vive en script.js.
window.QUESTION_BANK = {
    "normal": [
        {
            "text": "Menciona un dato que se pregunta en un censo de población.",
            "answers": [
                {
                    "text": "Edad",
                    "points": 35
                },
                {
                    "text": "Sexo",
                    "points": 25
                },
                {
                    "text": "Número de habitantes del hogar",
                    "points": 20
                },
                {
                    "text": "Escolaridad",
                    "points": 12
                },
                {
                    "text": "Ocupación",
                    "points": 8
                }
            ]
        },
        {
            "text": "¿Qué característica de una persona puede servir para estudiar una población?",
            "answers": [
                {
                    "text": "Edad",
                    "points": 35
                },
                {
                    "text": "Sexo",
                    "points": 25
                },
                {
                    "text": "Lugar de residencia",
                    "points": 20
                },
                {
                    "text": "Nivel de estudios",
                    "points": 12
                },
                {
                    "text": "Estado civil",
                    "points": 8
                }
            ]
        },
        {
            "text": "Menciona una razón por la que una ciudad comienza a tener más habitantes.",
            "answers": [
                {
                    "text": "Llegada de migrantes",
                    "points": 35
                },
                {
                    "text": "Nacimientos",
                    "points": 25
                },
                {
                    "text": "Oportunidades de trabajo",
                    "points": 20
                },
                {
                    "text": "Universidades",
                    "points": 12
                },
                {
                    "text": "Crecimiento de colonias",
                    "points": 8
                }
            ]
        },
        {
            "text": "¿Qué problemas pueden aparecer cuando una ciudad crece demasiado rápido?",
            "answers": [
                {
                    "text": "Tráfico",
                    "points": 35
                },
                {
                    "text": "Falta de vivienda",
                    "points": 25
                },
                {
                    "text": "Escasez de agua",
                    "points": 20
                },
                {
                    "text": "Saturación de hospitales",
                    "points": 12
                },
                {
                    "text": "Contaminación",
                    "points": 8
                }
            ]
        },
        {
            "text": "Menciona un lugar donde normalmente vive una gran cantidad de personas.",
            "answers": [
                {
                    "text": "Ciudad",
                    "points": 35
                },
                {
                    "text": "Zona metropolitana",
                    "points": 25
                },
                {
                    "text": "Capital",
                    "points": 20
                },
                {
                    "text": "Colonia urbana",
                    "points": 12
                },
                {
                    "text": "Municipio muy poblado",
                    "points": 8
                }
            ]
        },
        {
            "text": "¿Qué servicio público necesita una comunidad cuando aumenta su población?",
            "answers": [
                {
                    "text": "Agua potable",
                    "points": 35
                },
                {
                    "text": "Hospitales",
                    "points": 25
                },
                {
                    "text": "Escuelas",
                    "points": 20
                },
                {
                    "text": "Transporte público",
                    "points": 12
                },
                {
                    "text": "Recolección de basura",
                    "points": 8
                }
            ]
        },
        {
            "text": "Menciona una razón por la que una familia decide cambiarse de ciudad.",
            "answers": [
                {
                    "text": "Trabajo",
                    "points": 35
                },
                {
                    "text": "Estudios",
                    "points": 25
                },
                {
                    "text": "Seguridad",
                    "points": 20
                },
                {
                    "text": "Reunirse con familiares",
                    "points": 12
                },
                {
                    "text": "Costo de vida",
                    "points": 8
                }
            ]
        },
        {
            "text": "¿Qué información sería útil conocer antes de construir una nueva escuela?",
            "answers": [
                {
                    "text": "Cantidad de niños y jóvenes",
                    "points": 35
                },
                {
                    "text": "Ubicación de las familias",
                    "points": 25
                },
                {
                    "text": "Escuelas existentes",
                    "points": 20
                },
                {
                    "text": "Crecimiento de población",
                    "points": 12
                },
                {
                    "text": "Distancias o transporte",
                    "points": 8
                }
            ]
        },
        {
            "text": "Menciona una razón por la que las personas deciden tener menos hijos.",
            "answers": [
                {
                    "text": "Costo de mantenerlos",
                    "points": 35
                },
                {
                    "text": "Trabajo y carrera",
                    "points": 25
                },
                {
                    "text": "Falta de vivienda",
                    "points": 20
                },
                {
                    "text": "Preferencia personal",
                    "points": 12
                },
                {
                    "text": "Acceso a anticonceptivos",
                    "points": 8
                }
            ]
        },
        {
            "text": "¿Qué factor puede influir en la esperanza de vida de una población?",
            "answers": [
                {
                    "text": "Acceso a servicios de salud",
                    "points": 35
                },
                {
                    "text": "Alimentación",
                    "points": 25
                },
                {
                    "text": "Condiciones sanitarias",
                    "points": 20
                },
                {
                    "text": "Actividad física",
                    "points": 12
                },
                {
                    "text": "Violencia o accidentes",
                    "points": 8
                }
            ]
        },
        {
            "text": "Menciona una razón por la que las personas emigran a otro país.",
            "answers": [
                {
                    "text": "Buscar empleo",
                    "points": 35
                },
                {
                    "text": "Mejores ingresos",
                    "points": 25
                },
                {
                    "text": "Seguridad",
                    "points": 20
                },
                {
                    "text": "Reunificación familiar",
                    "points": 12
                },
                {
                    "text": "Estudiar",
                    "points": 8
                }
            ]
        },
        {
            "text": "¿Qué dificultades puede enfrentar una persona al mudarse a otro país?",
            "answers": [
                {
                    "text": "Idioma",
                    "points": 35
                },
                {
                    "text": "Conseguir trabajo",
                    "points": 25
                },
                {
                    "text": "Trámites migratorios",
                    "points": 20
                },
                {
                    "text": "Adaptación cultural",
                    "points": 12
                },
                {
                    "text": "Estar lejos de la familia",
                    "points": 8
                }
            ]
        },
        {
            "text": "Menciona un servicio que necesitan especialmente los adultos mayores.",
            "answers": [
                {
                    "text": "Atención médica",
                    "points": 35
                },
                {
                    "text": "Medicamentos",
                    "points": 25
                },
                {
                    "text": "Transporte accesible",
                    "points": 20
                },
                {
                    "text": "Cuidados a domicilio",
                    "points": 12
                },
                {
                    "text": "Centros de día",
                    "points": 8
                }
            ]
        },
        {
            "text": "¿Qué factores pueden provocar una disminución de la población?",
            "answers": [
                {
                    "text": "Emigración",
                    "points": 35
                },
                {
                    "text": "Menos nacimientos",
                    "points": 25
                },
                {
                    "text": "Muertes",
                    "points": 20
                },
                {
                    "text": "Desastres naturales",
                    "points": 12
                },
                {
                    "text": "Crisis económica",
                    "points": 8
                }
            ]
        },
        {
            "text": "Menciona algo que puede aumentar el número de nacimientos en una comunidad.",
            "answers": [
                {
                    "text": "Más personas en edad reproductiva",
                    "points": 35
                },
                {
                    "text": "Llegada de familias jóvenes",
                    "points": 25
                },
                {
                    "text": "Mayor número de parejas con hijos",
                    "points": 20
                },
                {
                    "text": "Mejores apoyos familiares",
                    "points": 12
                },
                {
                    "text": "Acceso a servicios de maternidad",
                    "points": 8
                }
            ]
        },
        {
            "text": "¿Qué consecuencias puede tener que una ciudad reciba muchos migrantes?",
            "answers": [
                {
                    "text": "Mayor demanda de vivienda",
                    "points": 35
                },
                {
                    "text": "Más trabajadores",
                    "points": 25
                },
                {
                    "text": "Diversidad cultural",
                    "points": 20
                },
                {
                    "text": "Más uso del transporte",
                    "points": 12
                },
                {
                    "text": "Mayor demanda escolar",
                    "points": 8
                }
            ]
        },
        {
            "text": "Menciona una forma de recopilar información sobre una población.",
            "answers": [
                {
                    "text": "Censo",
                    "points": 35
                },
                {
                    "text": "Encuesta",
                    "points": 25
                },
                {
                    "text": "Entrevista",
                    "points": 20
                },
                {
                    "text": "Registro de nacimientos",
                    "points": 12
                },
                {
                    "text": "Registro administrativo",
                    "points": 8
                }
            ]
        },
        {
            "text": "¿Qué institución mexicana se relaciona con los censos y las estadísticas?",
            "answers": [
                {
                    "text": "INEGI",
                    "points": 35
                },
                {
                    "text": "CONAPO",
                    "points": 25
                },
                {
                    "text": "Secretaría de Salud",
                    "points": 20
                },
                {
                    "text": "Registro Civil",
                    "points": 12
                },
                {
                    "text": "Institutos estatales de estadística",
                    "points": 8
                }
            ]
        },
        {
            "text": "Menciona una pregunta que incluirías en una encuesta demográfica.",
            "answers": [
                {
                    "text": "¿Cuántos años tiene?",
                    "points": 35
                },
                {
                    "text": "¿Dónde vive?",
                    "points": 25
                },
                {
                    "text": "¿Cuál es su escolaridad?",
                    "points": 20
                },
                {
                    "text": "¿Cuántas personas viven en su casa?",
                    "points": 12
                },
                {
                    "text": "¿Trabaja actualmente?",
                    "points": 8
                }
            ]
        },
        {
            "text": "¿En qué lugar podría realizarse una encuesta sobre las características de la población?",
            "answers": [
                {
                    "text": "Viviendas",
                    "points": 35
                },
                {
                    "text": "Escuelas",
                    "points": 25
                },
                {
                    "text": "Plazas públicas",
                    "points": 20
                },
                {
                    "text": "Centros de trabajo",
                    "points": 12
                },
                {
                    "text": "En línea",
                    "points": 8
                }
            ]
        },
        {
            "text": "¿Qué herramienta digital puede servir para analizar datos de una encuesta?",
            "answers": [
                {
                    "text": "Excel",
                    "points": 35
                },
                {
                    "text": "Google Sheets",
                    "points": 25
                },
                {
                    "text": "SPSS",
                    "points": 20
                },
                {
                    "text": "R",
                    "points": 12
                },
                {
                    "text": "Python",
                    "points": 8
                }
            ]
        },
        {
            "text": "Menciona un problema que puede ocurrir al realizar un censo.",
            "answers": [
                {
                    "text": "Personas ausentes",
                    "points": 35
                },
                {
                    "text": "Respuestas incorrectas",
                    "points": 25
                },
                {
                    "text": "Viviendas no localizadas",
                    "points": 20
                },
                {
                    "text": "Falta de encuestadores",
                    "points": 12
                },
                {
                    "text": "Dificultad de acceso",
                    "points": 8
                }
            ]
        },
        {
            "text": "¿Qué tipo de gráfica puede utilizarse para mostrar información demográfica?",
            "answers": [
                {
                    "text": "Gráfica de barras",
                    "points": 35
                },
                {
                    "text": "Pirámide poblacional",
                    "points": 25
                },
                {
                    "text": "Gráfica de líneas",
                    "points": 20
                },
                {
                    "text": "Gráfica circular",
                    "points": 12
                },
                {
                    "text": "Histograma",
                    "points": 8
                }
            ]
        },
        {
            "text": "¿Qué característica debe tener una encuesta para obtener respuestas confiables?",
            "answers": [
                {
                    "text": "Preguntas claras",
                    "points": 35
                },
                {
                    "text": "Muestra representativa",
                    "points": 25
                },
                {
                    "text": "Neutralidad en preguntas",
                    "points": 20
                },
                {
                    "text": "Privacidad",
                    "points": 12
                },
                {
                    "text": "Aplicación consistente",
                    "points": 8
                }
            ]
        },
        {
            "text": "Menciona una decisión del gobierno que podría apoyarse en datos demográficos.",
            "answers": [
                {
                    "text": "Construir escuelas",
                    "points": 35
                },
                {
                    "text": "Abrir hospitales",
                    "points": 25
                },
                {
                    "text": "Ampliar transporte",
                    "points": 20
                },
                {
                    "text": "Planear vivienda",
                    "points": 12
                },
                {
                    "text": "Distribuir presupuesto",
                    "points": 8
                }
            ]
        },
        {
            "text": "¿Qué negocio podría beneficiarse de conocer las edades de los habitantes de una zona?",
            "answers": [
                {
                    "text": "Tienda de ropa",
                    "points": 35
                },
                {
                    "text": "Juguetería",
                    "points": 25
                },
                {
                    "text": "Farmacia",
                    "points": 20
                },
                {
                    "text": "Guardería",
                    "points": 12
                },
                {
                    "text": "Gimnasio",
                    "points": 8
                }
            ]
        },
        {
            "text": "¿Qué información demográfica sería útil para construir un hospital?",
            "answers": [
                {
                    "text": "Número de habitantes",
                    "points": 35
                },
                {
                    "text": "Edad de la población",
                    "points": 25
                },
                {
                    "text": "Ubicación de las colonias",
                    "points": 20
                },
                {
                    "text": "Crecimiento poblacional",
                    "points": 12
                },
                {
                    "text": "Necesidades de atención médica",
                    "points": 8
                }
            ]
        },
        {
            "text": "¿Qué problema de transporte podría estudiarse utilizando datos poblacionales?",
            "answers": [
                {
                    "text": "Congestión vial",
                    "points": 35
                },
                {
                    "text": "Rutas insuficientes",
                    "points": 25
                },
                {
                    "text": "Autobuses saturados",
                    "points": 20
                },
                {
                    "text": "Largos tiempos de traslado",
                    "points": 12
                },
                {
                    "text": "Falta de transporte en colonias",
                    "points": 8
                }
            ]
        },
        {
            "text": "Menciona una profesión que utilice información demográfica.",
            "answers": [
                {
                    "text": "Urbanista",
                    "points": 35
                },
                {
                    "text": "Médico de salud pública",
                    "points": 25
                },
                {
                    "text": "Economista",
                    "points": 20
                },
                {
                    "text": "Sociólogo",
                    "points": 12
                },
                {
                    "text": "Estadístico",
                    "points": 8
                }
            ]
        },
        {
            "text": "¿Qué servicio podría necesitar una ciudad con muchos estudiantes universitarios?",
            "answers": [
                {
                    "text": "Transporte público",
                    "points": 35
                },
                {
                    "text": "Vivienda en renta",
                    "points": 25
                },
                {
                    "text": "Internet",
                    "points": 20
                },
                {
                    "text": "Bibliotecas",
                    "points": 12
                },
                {
                    "text": "Comedores económicos",
                    "points": 8
                }
            ]
        },
        {
            "text": "¿Qué tipo de establecimiento podría abrirse en una comunidad donde viven muchos adultos mayores?",
            "answers": [
                {
                    "text": "Farmacia",
                    "points": 35
                },
                {
                    "text": "Clínica",
                    "points": 25
                },
                {
                    "text": "Centro de rehabilitación",
                    "points": 20
                },
                {
                    "text": "Centro de día",
                    "points": 12
                },
                {
                    "text": "Tienda de productos de apoyo",
                    "points": 8
                }
            ]
        },
        {
            "text": "Menciona un problema que podría investigarse al observar que una comunidad está perdiendo habitantes.",
            "answers": [
                {
                    "text": "Falta de empleo",
                    "points": 35
                },
                {
                    "text": "Emigración de jóvenes",
                    "points": 25
                },
                {
                    "text": "Inseguridad",
                    "points": 20
                },
                {
                    "text": "Pocas escuelas",
                    "points": 12
                },
                {
                    "text": "Falta de servicios",
                    "points": 8
                }
            ]
        },
        {
            "text": "¿Qué puede provocar que los resultados de una encuesta sean incorrectos?",
            "answers": [
                {
                    "text": "Muestra no representativa",
                    "points": 35
                },
                {
                    "text": "Respuestas falsas",
                    "points": 25
                },
                {
                    "text": "Preguntas confusas",
                    "points": 20
                },
                {
                    "text": "Errores de captura",
                    "points": 12
                },
                {
                    "text": "Personas que no responden",
                    "points": 8
                }
            ]
        },
        {
            "text": "Menciona una ventaja de realizar un censo nacional.",
            "answers": [
                {
                    "text": "Contar habitantes",
                    "points": 35
                },
                {
                    "text": "Conocer edades",
                    "points": 25
                },
                {
                    "text": "Planear servicios",
                    "points": 20
                },
                {
                    "text": "Comparar regiones",
                    "points": 12
                },
                {
                    "text": "Distribuir recursos",
                    "points": 8
                }
            ]
        },
        {
            "text": "¿Por qué algunas personas podrían negarse a contestar una encuesta?",
            "answers": [
                {
                    "text": "Desconfianza",
                    "points": 35
                },
                {
                    "text": "Falta de tiempo",
                    "points": 25
                },
                {
                    "text": "Preocupación por privacidad",
                    "points": 20
                },
                {
                    "text": "Desinterés",
                    "points": 12
                },
                {
                    "text": "Preguntas incómodas",
                    "points": 8
                }
            ]
        },
        {
            "text": "¿Qué dificultad podría enfrentar un encuestador al visitar comunidades alejadas?",
            "answers": [
                {
                    "text": "Transporte difícil",
                    "points": 35
                },
                {
                    "text": "Caminos en mal estado",
                    "points": 25
                },
                {
                    "text": "Falta de señal",
                    "points": 20
                },
                {
                    "text": "Clima adverso",
                    "points": 12
                },
                {
                    "text": "Distancias largas",
                    "points": 8
                }
            ]
        },
        {
            "text": "¿Qué dato sobre una ciudad podría cambiar mucho en diez años?",
            "answers": [
                {
                    "text": "Cantidad de habitantes",
                    "points": 35
                },
                {
                    "text": "Edad promedio",
                    "points": 25
                },
                {
                    "text": "Número de viviendas",
                    "points": 20
                },
                {
                    "text": "Empleo",
                    "points": 12
                },
                {
                    "text": "Distribución por colonias",
                    "points": 8
                }
            ]
        },
        {
            "text": "¿Qué situación podría hacer que una proyección de población resulte equivocada?",
            "answers": [
                {
                    "text": "Migración inesperada",
                    "points": 35
                },
                {
                    "text": "Pandemia",
                    "points": 25
                },
                {
                    "text": "Desastre natural",
                    "points": 20
                },
                {
                    "text": "Cambio fuerte en natalidad",
                    "points": 12
                },
                {
                    "text": "Crisis económica",
                    "points": 8
                }
            ]
        },
        {
            "text": "Menciona una consecuencia de planificar una ciudad utilizando estadísticas desactualizadas.",
            "answers": [
                {
                    "text": "Escuelas insuficientes",
                    "points": 35
                },
                {
                    "text": "Hospitales saturados",
                    "points": 25
                },
                {
                    "text": "Falta de agua",
                    "points": 20
                },
                {
                    "text": "Transporte inadecuado",
                    "points": 12
                },
                {
                    "text": "Mala distribución de recursos",
                    "points": 8
                }
            ]
        },
        {
            "text": "¿Qué dato estadístico consultarías para saber si una población está envejeciendo?",
            "answers": [
                {
                    "text": "Porcentaje de mayores de 65 años",
                    "points": 35
                },
                {
                    "text": "Edad mediana",
                    "points": 25
                },
                {
                    "text": "Pirámide de edades",
                    "points": 20
                },
                {
                    "text": "Índice de envejecimiento",
                    "points": 12
                },
                {
                    "text": "Proporción de jóvenes",
                    "points": 8
                }
            ]
        }
    ],
    "wildcard": {
        "Viajes": [
            {
                "text": "Menciona algo que nunca debe faltar cuando vas de viaje.",
                "answers": [
                    {
                        "text": "Ropa",
                        "points": 35
                    },
                    {
                        "text": "Artículos de higiene",
                        "points": 25
                    },
                    {
                        "text": "Dinero",
                        "points": 20
                    },
                    {
                        "text": "Documentos (INE, pasaporte, etc.)",
                        "points": 12
                    },
                    {
                        "text": "Celular y cargador",
                        "points": 8
                    }
                ]
            },
            {
                "text": "¿Qué es lo primero que haces cuando llegas a un hotel?",
                "answers": [
                    {
                        "text": "Registrarte en recepción",
                        "points": 35
                    },
                    {
                        "text": "Dejar las maletas",
                        "points": 25
                    },
                    {
                        "text": "Buscar la habitación",
                        "points": 20
                    },
                    {
                        "text": "Revisar la cama",
                        "points": 12
                    },
                    {
                        "text": "Conectarte al wifi",
                        "points": 8
                    }
                ]
            }
        ],
        "Internet y redes": [
            {
                "text": "Menciona una aplicación que los jóvenes utilizan para entretenerse.",
                "answers": [
                    {
                        "text": "TikTok",
                        "points": 35
                    },
                    {
                        "text": "YouTube",
                        "points": 25
                    },
                    {
                        "text": "Instagram",
                        "points": 20
                    },
                    {
                        "text": "Facebook",
                        "points": 12
                    },
                    {
                        "text": "Twitch",
                        "points": 8
                    }
                ]
            },
            {
                "text": "¿Qué es lo más vergonzoso que podría pasarte durante una videollamada?",
                "answers": [
                    {
                        "text": "Micrófono abierto",
                        "points": 35
                    },
                    {
                        "text": "Cámara encendida sin querer",
                        "points": 25
                    },
                    {
                        "text": "Que alguien aparezca detrás",
                        "points": 20
                    },
                    {
                        "text": "Caerte o hacer el ridículo",
                        "points": 12
                    },
                    {
                        "text": "Compartir pantalla equivocada",
                        "points": 8
                    }
                ]
            }
        ],
        "Comida mexicana": [
            {
                "text": "Menciona algo que le pones a un taco.",
                "answers": [
                    {
                        "text": "Salsa",
                        "points": 35
                    },
                    {
                        "text": "Cilantro",
                        "points": 25
                    },
                    {
                        "text": "Cebolla",
                        "points": 20
                    },
                    {
                        "text": "Guacamole",
                        "points": 12
                    },
                    {
                        "text": "Limón",
                        "points": 8
                    }
                ]
            },
            {
                "text": "¿Qué comida comprarías después de salir de una fiesta?",
                "answers": [
                    {
                        "text": "Tacos",
                        "points": 35
                    },
                    {
                        "text": "Hamburguesas / hot dogs",
                        "points": 25
                    },
                    {
                        "text": "Caldos (pozole, menudo, birria, etc.)",
                        "points": 20
                    },
                    {
                        "text": "Aguachile",
                        "points": 12
                    },
                    {
                        "text": "Tortas (ahogadas o normales)",
                        "points": 8
                    }
                ]
            }
        ],
        "Videojuegos": [
            {
                "text": "Menciona un videojuego retro o clásico que casi todo el mundo conozca.",
                "answers": [
                    {
                        "text": "PAC-MAN",
                        "points": 30
                    },
                    {
                        "text": "Super Mario Bros.",
                        "points": 24
                    },
                    {
                        "text": "Tetris",
                        "points": 18
                    },
                    {
                        "text": "Space Invaders",
                        "points": 12
                    },
                    {
                        "text": "Donkey Kong",
                        "points": 9
                    },
                    {
                        "text": "DOOM",
                        "points": 7
                    }
                ]
            },
            {
                "text": "¿Qué es lo que más hace enojar a alguien mientras juega videojuegos?",
                "answers": [
                    {
                        "text": "Perder",
                        "points": 35
                    },
                    {
                        "text": "Lag o internet lento",
                        "points": 25
                    },
                    {
                        "text": "Compañero que juega mal",
                        "points": 20
                    },
                    {
                        "text": "Hacer trampa",
                        "points": 12
                    },
                    {
                        "text": "Que se apague la consola",
                        "points": 8
                    }
                ]
            }
        ],
        "UAN": [
            {
                "text": "Menciona algo que un estudiante de la UAN suele llevar en su mochila.",
                "answers": [
                    {
                        "text": "Cuaderno",
                        "points": 35
                    },
                    {
                        "text": "Laptop",
                        "points": 25
                    },
                    {
                        "text": "Pluma",
                        "points": 20
                    },
                    {
                        "text": "Cargador",
                        "points": 12
                    },
                    {
                        "text": "Botella de agua",
                        "points": 8
                    }
                ]
            },
            {
                "text": "¿Cuál es la excusa más común que pone un estudiante de la UAN cuando llega tarde a clases?",
                "answers": [
                    {
                        "text": "Había tráfico",
                        "points": 30
                    },
                    {
                        "text": "No pasó el camión",
                        "points": 24
                    },
                    {
                        "text": "Me quedé dormido",
                        "points": 18
                    },
                    {
                        "text": "Sonó mal la alarma",
                        "points": 12
                    },
                    {
                        "text": "Se me hizo tarde por trabajo",
                        "points": 9
                    },
                    {
                        "text": "Se me atravesó el tren",
                        "points": 7
                    }
                ]
            }
        ],
        "Cine": [
            {
                "text": "¿Cuáles fueron las sitcoms juveniles más exitosas de Nickelodeon en los 2000?",
                "answers": [
                    {
                        "text": "Drake & Josh",
                        "points": 30
                    },
                    {
                        "text": "iCarly",
                        "points": 24
                    },
                    {
                        "text": "Victorious",
                        "points": 18
                    },
                    {
                        "text": "Zoey 101",
                        "points": 12
                    },
                    {
                        "text": "Manual de supervivencia escolar de Ned",
                        "points": 9
                    },
                    {
                        "text": "Big Time Rush",
                        "points": 7
                    }
                ]
            },
            {
                "text": "¿Qué cosa molesta hace la gente cuando está en el cine?",
                "answers": [
                    {
                        "text": "Hablar",
                        "points": 35
                    },
                    {
                        "text": "Usar el celular",
                        "points": 25
                    },
                    {
                        "text": "Patear el asiento",
                        "points": 20
                    },
                    {
                        "text": "Hacer ruido al comer",
                        "points": 12
                    },
                    {
                        "text": "Llegar tarde",
                        "points": 8
                    }
                ]
            }
        ],
        "Deportes": [
            {
                "text": "Menciona un deporte que se juegue utilizando una pelota.",
                "answers": [
                    {
                        "text": "Fútbol",
                        "points": 35
                    },
                    {
                        "text": "Básquetbol",
                        "points": 25
                    },
                    {
                        "text": "Béisbol",
                        "points": 20
                    },
                    {
                        "text": "Voleibol",
                        "points": 12
                    },
                    {
                        "text": "Tenis",
                        "points": 8
                    }
                ]
            },
            {
                "text": "¿Qué excusa pone alguien cuando pierde un partido?",
                "answers": [
                    {
                        "text": "El árbitro tuvo la culpa",
                        "points": 35
                    },
                    {
                        "text": "Estaba lesionado",
                        "points": 25
                    },
                    {
                        "text": "El rival hizo trampa",
                        "points": 20
                    },
                    {
                        "text": "No calenté",
                        "points": 12
                    },
                    {
                        "text": "Mi equipo no ayudó",
                        "points": 8
                    }
                ]
            }
        ],
        "Vida cotidiana": [
            {
                "text": "¿Qué es lo primero que hace una persona al despertarse?",
                "answers": [
                    {
                        "text": "Abrir los ojos",
                        "points": 30
                    },
                    {
                        "text": "Revisar el celular",
                        "points": 24
                    },
                    {
                        "text": "Ir al baño",
                        "points": 18
                    },
                    {
                        "text": "Apagar la alarma",
                        "points": 12
                    },
                    {
                        "text": "Levantarse de la cama",
                        "points": 9
                    },
                    {
                        "text": "Tomar agua",
                        "points": 7
                    }
                ]
            },
            {
                "text": "Menciona algo que siempre se pierde cuando tienes prisa.",
                "answers": [
                    {
                        "text": "Llaves",
                        "points": 35
                    },
                    {
                        "text": "Celular",
                        "points": 25
                    },
                    {
                        "text": "Cartera",
                        "points": 20
                    },
                    {
                        "text": "Lentes",
                        "points": 12
                    },
                    {
                        "text": "Credencial",
                        "points": 8
                    }
                ]
            }
        ],
        "Programación": [
            {
                "text": "Menciona un lenguaje de programación que conozcas.",
                "answers": [
                    {
                        "text": "Python",
                        "points": 35
                    },
                    {
                        "text": "JavaScript",
                        "points": 25
                    },
                    {
                        "text": "Java",
                        "points": 20
                    },
                    {
                        "text": "C++",
                        "points": 12
                    },
                    {
                        "text": "C#",
                        "points": 8
                    }
                ]
            },
            {
                "text": "¿Qué es lo primero que hace un programador cuando su código no funciona?",
                "answers": [
                    {
                        "text": "Revisar errores",
                        "points": 35
                    },
                    {
                        "text": "Buscar en Google",
                        "points": 25
                    },
                    {
                        "text": "Leer la consola",
                        "points": 20
                    },
                    {
                        "text": "Pedir ayuda a IA",
                        "points": 12
                    },
                    {
                        "text": "Reiniciar o volver a ejecutar",
                        "points": 8
                    }
                ]
            }
        ],
        "Música": [
            {
                "text": "Menciona un artista o banda mexicana que casi todos conozcan.",
                "answers": [
                    {
                        "text": "Luis Miguel",
                        "points": 35
                    },
                    {
                        "text": "Juan Gabriel",
                        "points": 25
                    },
                    {
                        "text": "Peso Pluma",
                        "points": 20
                    },
                    {
                        "text": "Maná",
                        "points": 12
                    },
                    {
                        "text": "Natanael Cano",
                        "points": 8
                    }
                ]
            },
            {
                "text": "¿Qué artista o banda mexicana ha recibido más nominaciones a los premios Grammy?",
                "answers": [
                    {
                        "text": "Los Tigres del Norte",
                        "points": 30
                    },
                    {
                        "text": "Luis Miguel",
                        "points": 24
                    },
                    {
                        "text": "Vicente Fernández",
                        "points": 18
                    },
                    {
                        "text": "Natalia Lafourcade",
                        "points": 12
                    },
                    {
                        "text": "Pepe Aguilar",
                        "points": 9
                    },
                    {
                        "text": "Maná",
                        "points": 7
                    }
                ]
            }
        ]
    }
};
